import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CatalogoItem } from "../../entities/catalogo-item.entity";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface IaSugestaoProposta {
  titulo: string;
  introducao: string;
  itens: {
    itemCatalogoId: string;
    nome: string;
    descricao: string;
    quantidade: number;
    pricingTier: "G" | "M" | "P";
    justificativa: string;
  }[];
  observacoes: string;
}

@Injectable()
export class IaPropostaService {
  private readonly logger = new Logger(IaPropostaService.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor(
    @InjectRepository(CatalogoItem)
    private catalogoRepo: Repository<CatalogoItem>,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn(
        "GEMINI_API_KEY não configurada — assistente IA desabilitado",
      );
    }
  }

  async sugerirProposta(
    descricaoProjeto: string,
    marcaId?: number | null,
  ): Promise<IaSugestaoProposta> {
    if (!this.genAI) {
      throw new Error("Assistente IA não está configurado (GEMINI_API_KEY)");
    }

    // Load catalog
    const qb = this.catalogoRepo
      .createQueryBuilder("item")
      .where("item.ativo = :ativo", { ativo: true });

    if (marcaId) {
      qb.innerJoin("item.marcas", "marca", "marca.id = :marcaId", { marcaId });
    }

    const catalogo = await qb.getMany();

    if (catalogo.length === 0) {
      // Fallback: load all active items
      const todos = await this.catalogoRepo.find({
        where: { ativo: true },
      });
      catalogo.push(...todos);
    }

    const catalogoTexto = catalogo
      .map(
        (item) =>
          `[ID:${item.id}] ${item.tipo} — ${item.especificacoes}` +
          ` | G:R$${item.precoG}` +
          (item.precoM ? ` M:R$${item.precoM}` : "") +
          (item.precoP ? ` P:R$${item.precoP}` : "") +
          (item.inclui ? ` | Inclui: ${item.inclui}` : "") +
          (item.naoInclui ? ` | Não inclui: ${item.naoInclui}` : ""),
      )
      .join("\n");

    const prompt = `Você é um assistente especialista em propostas comerciais de uma produtora audiovisual chamada FilmeLab.

CATÁLOGO DE SERVIÇOS DISPONÍVEL:
${catalogoTexto}

DESCRIÇÃO DO PROJETO DO CLIENTE:
${descricaoProjeto}

INSTRUÇÕES:
1. Analise a descrição do projeto e selecione os itens mais adequados do catálogo acima.
2. Para cada item, escolha o pricing tier (G = premium/completo, M = intermediário, P = econômico) baseado no contexto do projeto.
3. Sugira quantidades realistas para cada item.
4. Crie um título curto e profissional para a proposta.
5. Escreva uma introdução personalizada (2-3 frases) mencionando o projeto do cliente.
6. Se o projeto pedir algo que NÃO existe no catálogo, NÃO invente - mencione isso nas observações.

RESPONDA EXCLUSIVAMENTE no seguinte formato JSON (sem markdown, sem backticks):
{
  "titulo": "Título da proposta",
  "introducao": "Introdução personalizada...",
  "itens": [
    {
      "itemCatalogoId": "id-exato-do-catalogo",
      "nome": "Nome do serviço",
      "descricao": "Descrição contextualizada para este projeto",
      "quantidade": 1,
      "pricingTier": "G",
      "justificativa": "Por que este item é relevante para o projeto, use linguagem lúdica e envolvente"
    }
  ],
  "observacoes": "Observações gerais sobre a proposta ou itens não encontrados no catálogo"
}`;

    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Retry with backoff for rate limits (429)
    let lastError: any;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent(
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          },
          { timeout: 90000 },
        );
        const text = result.response.text();

        // Parse JSON from response (strip any markdown fencing if present)
        const jsonStr = text
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();

        try {
          const parsed = JSON.parse(jsonStr) as IaSugestaoProposta;

          // Validate that itemCatalogoId references exist
          const catalogoIds = new Set(catalogo.map((c) => c.id));
          parsed.itens = parsed.itens.filter((item) => {
            if (!catalogoIds.has(item.itemCatalogoId)) {
              this.logger.warn(
                `IA sugeriu item inexistente: ${item.itemCatalogoId} — removido`,
              );
              return false;
            }
            return true;
          });

          return parsed;
        } catch (e) {
          this.logger.error("Falha ao parsear resposta da IA", text);
          throw new Error(
            "A IA retornou uma resposta inválida. Tente novamente.",
          );
        }
      } catch (err: any) {
        lastError = err;
        if (err?.status === 429) {
          // Check if any violation is a daily quota — no point retrying
          const violations: any[] =
            err?.errorDetails?.find(
              (d: any) =>
                d["@type"] === "type.googleapis.com/google.rpc.QuotaFailure",
            )?.violations ?? [];

          const isDailyQuota = violations.some((v: any) =>
            v?.quotaId?.includes("PerDay"),
          );

          if (isDailyQuota) {
            this.logger.error(
              "Cota diária da API Gemini esgotada. Nenhuma tentativa adicional.",
            );
            const dailyErr: any = new Error(
              "Cota diária da API Gemini esgotada. Tente novamente amanhã.",
            );
            dailyErr.status = 429;
            dailyErr.isDailyQuota = true;
            throw dailyErr;
          }

          if (attempt < 2) {
            // Use retryDelay from the error when available
            const retryInfo = err?.errorDetails?.find(
              (d: any) =>
                d["@type"] === "type.googleapis.com/google.rpc.RetryInfo",
            );
            const retryDelayStr: string = retryInfo?.retryDelay ?? "";
            const retryDelaySec = retryDelayStr
              ? parseInt(retryDelayStr.replace("s", ""), 10) + 2
              : (attempt + 1) * 20;

            this.logger.warn(
              `Rate limit atingido (429). Tentativa ${attempt + 1}/3. Aguardando ${retryDelaySec}s...`,
            );
            await new Promise((r) => setTimeout(r, retryDelaySec * 1000));
            continue;
          }
        }
        throw err;
      }
    }

    throw lastError;
  }
}
