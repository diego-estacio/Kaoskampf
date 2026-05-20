import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Contato,
  StatusContato,
  LeadTemperatura,
  ContatoInfo,
  TipoContato,
} from "../../entities/contato.entity";
import { Empresa, PorteEmpresa } from "../../entities/empresa.entity";
import { Timeline, TipoAtividade } from "../../entities/timeline.entity";
import { Observacao } from "../../entities/observacao.entity";
import { Usuario } from "../../entities/usuario.entity";
import { EmpresaService } from "../empresa/empresa.service";
import { NotificacaoService } from "../notificacao/notificacao.service";
import { PlannerWebhookService } from "../planner/planner-webhook.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MoreThanOrEqual, Not, Between } from "typeorm";

export interface CriarContatoDto {
  nome: string;
  cargo?: string;
  observacaoInicial?: string; // Observação opcional ao cadastrar
  contatos?: ContatoInfo;
  lead?: LeadTemperatura;
  tipoContato?: TipoContato;
  empresaId?: string;
  novaEmpresa?: {
    nome: string;
    porte?: PorteEmpresa;
    site?: string;
    marcas?: string;
    observacoes?: string;
  };
  usuarioCriadorId: string;
  // ✅ NOVO: Campos opcionais para perfis (mantém compatibilidade)
  perfilAtual?: number; // 1, 2 ou 3 (padrão será 1)
  tentativasPerfil1?: number; // 0-5 (padrão será 0)
  tentativasPerfil2?: number; // 0-5 (padrão será 0)
  tentativasPerfil3?: number; // 0-5 (padrão será 0)
}

export interface AtualizarContatoDto {
  nome?: string;
  cargo?: string;
  // observacoes removido - agora é tratado separadamente
  contatos?: ContatoInfo;
  status?: StatusContato;
  lead?: LeadTemperatura;
  tipoContato?: TipoContato;
  diasProximoContato?: number;
  empresaId?: string;
  // ✅ NOVO: Campos opcionais para atualizar perfis
  perfilAtual?: number; // 1, 2 ou 3
  tentativasPerfil1?: number; // 0-5
  tentativasPerfil2?: number; // 0-5
  tentativasPerfil3?: number; // 0-5
}

@Injectable()
export class ContatoService {
  private determinarLeadPorStatus(status: StatusContato): LeadTemperatura {
    switch (status) {
      case StatusContato.CADASTRO:
        return LeadTemperatura.FRIO;

      case StatusContato.REUNIAO:
        return LeadTemperatura.MORNO;
      case StatusContato.PROPOSTA:
        return LeadTemperatura.QUENTE;
      case StatusContato.ATENDIMENTO:
        return LeadTemperatura.QUENTE;
      case StatusContato.INATIVO:
        return LeadTemperatura.INATIVO;
      case StatusContato.REATIVADO:
        return LeadTemperatura.FRIO;
      default:
        return LeadTemperatura.FRIO;
    }
  }
  constructor(
    @InjectRepository(Contato)
    private contatoRepository: Repository<Contato>,
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
    @InjectRepository(Timeline)
    private timelineRepository: Repository<Timeline>,
    @InjectRepository(Observacao)
    private observacaoRepository: Repository<Observacao>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private empresaService: EmpresaService,
    private notificacaoService: NotificacaoService,
    private plannerWebhook: PlannerWebhookService,
  ) {}

  async criar(criarContatoDto: CriarContatoDto): Promise<Contato> {
    let empresaId = criarContatoDto.empresaId;

    // Se não tem empresa mas tem dados para criar nova empresa
    if (!empresaId && criarContatoDto.novaEmpresa) {
      const novaEmpresa = await this.empresaService.criar(
        criarContatoDto.novaEmpresa,
      );
      empresaId = novaEmpresa.id;
    }

    const proximoContato = new Date();
    proximoContato.setDate(proximoContato.getDate() + 3); // 3 dias por padrão

    const contato = this.contatoRepository.create({
      nome: criarContatoDto.nome,
      cargo: criarContatoDto.cargo,
      contatos: criarContatoDto.contatos,
      status: StatusContato.CADASTRO,
      numeroContatos: 0,
      empresaId,
      usuarioCriadorId: criarContatoDto.usuarioCriadorId,
      proximoContato,
      tipoContato: criarContatoDto.tipoContato || TipoContato.LEAD,
    });
    contato.lead = this.determinarLeadPorStatus(contato.status);

    const contatoSalvo = await this.contatoRepository.save(contato);

    // ✅ Criar observação inicial automaticamente
    const textoObservacaoInicial = criarContatoDto.observacaoInicial
      ? `Contato cadastrado. Observação: ${criarContatoDto.observacaoInicial}`
      : "Contato cadastrado.";

    await this.criarObservacao(
      contatoSalvo.id,
      textoObservacaoInicial,
      criarContatoDto.usuarioCriadorId,
    );

    // Registrar na timeline
    await this.registrarTimeline(
      criarContatoDto.usuarioCriadorId,
      contatoSalvo.id,
      "Contato cadastrado",
      TipoAtividade.CADASTRO,
      `Contato ${criarContatoDto.nome} foi cadastrado no sistema`,
    );

    // 🔗 Notificar o Planner: novo contato cadastrado
    this.buscarEmailUsuario(criarContatoDto.usuarioCriadorId).then((email) => {
      if (email) {
        this.plannerWebhook.notificarPlanner(
          email,
          'contact.created',
          0,
          `Contato: ${criarContatoDto.nome}`,
        ).catch(() => {});
      }
    });

    return contatoSalvo;
  }

  async buscarTodos(): Promise<Contato[]> {
    return this.contatoRepository.find({
      relations: ["empresa", "usuarioCriador"],
      order: { proximoContato: "ASC" },
    });
  }

  async buscarPorId(id: string): Promise<Contato> {
    return this.contatoRepository.findOne({
      where: { id },
      relations: ["empresa", "usuarioCriador", "atividades"],
    });
  }

  async atualizar(id: string, dados: AtualizarContatoDto): Promise<Contato> {
    console.log("🔧 ATUALIZAR - Dados recebidos:", JSON.stringify(dados));

    // Converter status de string para number se necessário
    if (dados.status !== undefined && typeof dados.status === "string") {
      dados.status = parseInt(dados.status, 10) as StatusContato;
      console.log(
        `🔄 Status convertido de string para number: ${dados.status}`,
      );
    }

    // Validar empresaId se foi enviado
    if (dados.empresaId) {
      const empresa = await this.empresaRepository.findOne({
        where: { id: dados.empresaId },
      });

      if (!empresa) {
        // Se a empresa não existir mais, ignorar o empresaId inválido
        // para não bloquear a edição do contato.
        console.warn(
          `⚠️ Empresa não encontrada para empresaId=${dados.empresaId} ao atualizar contato ${id}. Ignorando troca de empresa.`,
        );
        delete dados.empresaId;
      }
    }

    // Atualizar os dados
    await this.contatoRepository.update(id, dados);

    // Buscar o contato atualizado
    const contato = await this.buscarPorId(id);

    // SEMPRE recalcular o lead baseado no status atual
    const novoLead = this.determinarLeadPorStatus(contato.status);
    console.log(
      `🔥 RECALCULANDO LEAD - Status: ${
        contato.status
      } (tipo: ${typeof contato.status}) → Lead: ${novoLead}`,
    );

    // Atualizar o lead no banco
    await this.contatoRepository.update(id, { lead: novoLead });

    // Buscar novamente para retornar com o lead atualizado
    const contatoFinal = await this.buscarPorId(id);
    console.log(
      `✅ CONTATO SALVO - ID: ${contatoFinal.id}, Status: ${contatoFinal.status}, Lead: ${contatoFinal.lead}`,
    );

    // Atualizar status da empresa se necessário
    if (dados.status !== undefined || dados.empresaId) {
      await this.empresaService.atualizarStatusEmpresa(contatoFinal.empresaId);
    }

    // Se o status chegou em ATENDIMENTO, garantir que o contato vire CLIENTE automaticamente
    if (
      contatoFinal.status === StatusContato.ATENDIMENTO &&
      contatoFinal.tipoContato !== TipoContato.CLIENTE
    ) {
      await this.contatoRepository.update(id, {
        tipoContato: TipoContato.CLIENTE,
      });
      contatoFinal.tipoContato = TipoContato.CLIENTE;
    }

    return contatoFinal;
  }

  async marcarContato(
    id: string,
    usuarioId: string,
    observacao?: string,
  ): Promise<Contato> {
    const contato = await this.buscarPorId(id);

    // ✅ NOVO: Sistema de 3 Perfis
    const perfilAtual = contato.perfilAtual || 1;
    let tentativasPerfil1 = contato.tentativasPerfil1 || 0;
    let tentativasPerfil2 = contato.tentativasPerfil2 || 0;
    let tentativasPerfil3 = contato.tentativasPerfil3 || 0;
    let novoPerfilAtual = perfilAtual;

    // Incrementar tentativa do perfil atual
    if (perfilAtual === 1) {
      tentativasPerfil1++;
    } else if (perfilAtual === 2) {
      tentativasPerfil2++;
    } else if (perfilAtual === 3) {
      tentativasPerfil3++;
    }

    // Verificar se precisa avançar para próximo perfil
    if (perfilAtual === 1 && tentativasPerfil1 >= 5) {
      novoPerfilAtual = 2;
      console.log(`🔄 ${contato.nome}: Avançando para Perfil 2`);
    } else if (perfilAtual === 2 && tentativasPerfil2 >= 5) {
      novoPerfilAtual = 3;
      console.log(`🔄 ${contato.nome}: Avançando para Perfil 3`);
    } else if (perfilAtual === 3 && tentativasPerfil3 >= 5) {
      console.log(
        `⚠️ ATENÇÃO: ${contato.nome} completou todos os 3 perfis (15 tentativas)! Será inativado pelo job automático após 3 dias sem resposta.`,
      );
    }

    // Manter compatibilidade: atualizar numeroContatos total
    const novoNumeroContatos =
      tentativasPerfil1 + tentativasPerfil2 + tentativasPerfil3;

    // Calcular próximo contato (usando timezone do Brasil)
    const agoraBrasil = this.getBrasilTimezone();
    const proximoContato = new Date(agoraBrasil);
    proximoContato.setDate(
      proximoContato.getDate() + contato.diasProximoContato,
    );

    // ✅ Atualizar contato no banco com novos campos de perfil
    await this.contatoRepository.update(id, {
      numeroContatos: novoNumeroContatos,
      perfilAtual: novoPerfilAtual,
      tentativasPerfil1,
      tentativasPerfil2,
      tentativasPerfil3,
      proximoContato,
      ultimoContatoRealizado: agoraBrasil,
    });

    // ✅ Registrar na timeline com informação do perfil
    const labelPerfil = `Perfil ${perfilAtual}`;
    const tentativaAtual =
      perfilAtual === 1
        ? tentativasPerfil1
        : perfilAtual === 2
          ? tentativasPerfil2
          : tentativasPerfil3;

    const textoTimeline =
      observacao ||
      `${labelPerfil} - ${tentativaAtual}ª tentativa (${novoNumeroContatos}º contato total)`;

    await this.registrarTimeline(
      usuarioId,
      id,
      "Tentativa de contato",
      TipoAtividade.TENTATIVA_CONTATO,
      textoTimeline,
    );

    // 🔗 Notificar o Planner: tentativa de contato (call)
    this.buscarEmailUsuario(usuarioId).then((email) => {
      if (email) {
        this.plannerWebhook.notificarPlanner(
          email,
          'call.completed',
          0,
          `Tentativa de contato com ${contato.nome}`,
        ).catch(() => {});
      }
    });

    return this.buscarPorId(id);
  }

  async buscarProximosContatos(diasAntes: number = 1): Promise<Contato[]> {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + diasAntes);

    return this.contatoRepository.find({
      where: {
        proximoContato: { $lte: dataLimite } as any,
      },
      relations: ["empresa", "usuarioCriador"],
      order: { proximoContato: "ASC" },
    });
  }

  async filtrar(filtros: {
    nome?: string;
    empresaId?: string;
    status?: StatusContato[];
    lead?: LeadTemperatura[];
  }): Promise<Contato[]> {
    const query = this.contatoRepository
      .createQueryBuilder("contato")
      .leftJoinAndSelect("contato.empresa", "empresa")
      .leftJoinAndSelect("contato.usuarioCriador", "usuarioCriador");

    if (filtros.nome) {
      query.andWhere("contato.nome ILIKE :nome", { nome: `%${filtros.nome}%` });
    }

    if (filtros.empresaId) {
      query.andWhere("contato.empresaId = :empresaId", {
        empresaId: filtros.empresaId,
      });
    }

    if (filtros.status && filtros.status.length > 0) {
      query.andWhere("contato.status IN (:...status)", {
        status: filtros.status,
      });
    }

    if (filtros.lead && filtros.lead.length > 0) {
      query.andWhere("contato.lead IN (:...lead)", { lead: filtros.lead });
    }

    return query.orderBy("contato.proximoContato", "ASC").getMany();
  }

  // Observações
  async criarObservacao(
    contatoId: string,
    texto: string,
    autorId: string,
  ): Promise<Observacao> {
    const observacao = this.observacaoRepository.create({
      contatoId,
      texto,
      autorId,
    });

    const observacaoSalva = await this.observacaoRepository.save(observacao);

    // Registrar na timeline
    await this.registrarTimeline(
      autorId,
      contatoId,
      "Observação adicionada",
      TipoAtividade.OBSERVACAO,
      texto.substring(0, 100), // Truncar para não ficar muito longo
    );

    return observacaoSalva;
  }

  async buscarObservacoes(contatoId: string): Promise<Observacao[]> {
    return this.observacaoRepository.find({
      where: { contatoId },
      relations: ["autor"],
      order: { criadaEm: "DESC" },
    });
  }

  // Atualizar status
  async atualizarStatus(id: string, status: string): Promise<Contato> {
    const contato = await this.contatoRepository.findOne({
      where: { id },
      relations: ["empresa", "usuarioCriador"],
    });

    if (!contato) {
      throw new Error("Contato não encontrado");
    }

    contato.status = parseInt(status) as StatusContato;
    contato.lead = this.determinarLeadPorStatus(contato.status); // Atualizar lead automaticamente

    // Quando o status chega em ATENDIMENTO, o contato passa a ser CLIENTE automaticamente
    if (contato.status === StatusContato.ATENDIMENTO) {
      contato.tipoContato = TipoContato.CLIENTE;
    }

    return this.contatoRepository.save(contato);
  }

  async atualizarTipoContato(
    id: string,
    tipoContato: TipoContato,
  ): Promise<Contato> {
    const contato = await this.contatoRepository.findOne({
      where: { id },
      relations: ["empresa", "usuarioCriador"],
    });

    if (!contato) {
      throw new Error("Contato não encontrado");
    }

    contato.tipoContato = tipoContato;

    return this.contatoRepository.save(contato);
  }

  // Endpoint utilitário/temporário para recalcular lead e tipoContato
  // com base no status atual (útil após updates via SQL ou migrations)
  async recalcularLeadETipoContato(): Promise<{
    total: number;
    atualizados: number;
  }> {
    const contatos = await this.contatoRepository.find();
    let atualizados = 0;

    for (const contato of contatos) {
      const novoLead = this.determinarLeadPorStatus(contato.status);
      let novoTipo = contato.tipoContato;

      if (contato.status === StatusContato.ATENDIMENTO) {
        novoTipo = TipoContato.CLIENTE;
      }

      const updatePayload: Partial<Contato> = {};

      if (contato.lead !== novoLead) {
        updatePayload.lead = novoLead;
      }

      if (novoTipo !== contato.tipoContato) {
        updatePayload.tipoContato = novoTipo;
      }

      if (Object.keys(updatePayload).length > 0) {
        await this.contatoRepository.update(contato.id, updatePayload);
        atualizados++;
      }
    }

    return { total: contatos.length, atualizados };
  }

  async remover(id: string): Promise<void> {
    // Remove notificações associadas antes de excluir o contato, para evitar problemas de FK
    await this.notificacaoService.removerPorContato(id);
    await this.contatoRepository.delete(id);
  }

  // Buscar notificações pendentes
  async buscarNotificacoesPendentes(usuarioId: string) {
    // Ajustar para timezone do Brasil (UTC-3)
    const agoraBrasil = this.getBrasilTimezone();

    // Data de amanhã para notificações "1 dia antes"
    const amanha = new Date(agoraBrasil);
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(23, 59, 59, 999);

    // Buscar contatos que precisam de atenção
    const contatos = await this.contatoRepository.find({
      where: {
        usuarioCriadorId: usuarioId,
      },
      relations: ["empresa"],
      order: { proximoContato: "ASC" },
    });

    const notificacoes = [];

    for (const contato of contatos) {
      // Pular clientes e contatos sem data de próximo contato
      if (
        contato.tipoContato === TipoContato.CLIENTE ||
        !contato.proximoContato
      ) {
        continue;
      }

      const proximoContato = new Date(contato.proximoContato);

      // Verificar se é uma data válida
      if (isNaN(proximoContato.getTime())) {
        continue;
      }

      // Notificação URGENTE - data passou ou é hoje
      if (proximoContato <= agoraBrasil) {
        const diasAtrasados = Math.floor(
          (agoraBrasil.getTime() - proximoContato.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        notificacoes.push({
          id: contato.id,
          tipo: "urgente",
          titulo: `URGENTE: Contatar ${contato.nome}`,
          mensagem:
            diasAtrasados > 0
              ? `Atrasado há ${diasAtrasados} dia${
                  diasAtrasados > 1 ? "s" : ""
                }`
              : "Contatar hoje",
          contato: {
            id: contato.id,
            nome: contato.nome,
            empresa: contato.empresa?.nome || "Sem empresa",
          },
          dataLimite: proximoContato,
        });
      }
      // Notificação AVISO - amanhã
      else if (proximoContato <= amanha) {
        notificacoes.push({
          id: contato.id,
          tipo: "aviso",
          titulo: `Lembrete: Contatar ${contato.nome}`,
          mensagem: "Contatar amanhã",
          contato: {
            id: contato.id,
            nome: contato.nome,
            empresa: contato.empresa?.nome || "Sem empresa",
          },
          dataLimite: proximoContato,
        });
      }
    }

    return notificacoes;
  }
  private async registrarTimeline(
    usuarioId: string,
    contatoId: string,
    atividade: string,
    tipo: TipoAtividade,
    descricao?: string,
  ): Promise<void> {
    const timeline = this.timelineRepository.create({
      usuarioId,
      contatoId,
      atividade,
      tipo,
      descricao,
    });

    await this.timelineRepository.save(timeline);
  }

  /**
   * Busca o email de um usuário pelo ID.
   * Utilizado para identificar o vendedor ao notificar o Planner.
   */
  private async buscarEmailUsuario(usuarioId: string): Promise<string | null> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: usuarioId },
        select: ["email"],
      });
      return usuario?.email || null;
    } catch {
      return null;
    }
  }

  // ===========================
  // 🔧 MÉTODOS UTILITÁRIOS
  // ===========================

  /**
   * Obtém data/hora atual ajustada para timezone do Brasil (UTC-3)
   * Centraliza lógica de timezone para evitar duplicação
   */
  private getBrasilTimezone(): Date {
    const agora = new Date();
    return new Date(agora.getTime() - 3 * 60 * 60 * 1000);
  }

  // ===========================
  // 🤖 JOBS AUTOMÁTICOS (CRON)
  // ===========================

  /**
   * JOB #1: Notificar contatos HOJE e AMANHÃ
   * Roda todos os dias às 9h da manhã
   */
  @Cron("0 9 * * *", { name: "notificar-contatos-diarios" })
  async notificarContatosDiarios() {
    console.log("🔔 [JOB] Verificando contatos para hoje e amanhã...");

    const hoje = new Date();

    // ===== CONTATOS DE HOJE =====
    const inicioDoDia = new Date(hoje);
    inicioDoDia.setHours(0, 0, 0, 0);

    const fimDoDia = new Date(hoje);
    fimDoDia.setHours(23, 59, 59, 999);

    try {
      // Buscar contatos para HOJE
      const contatosHoje = await this.contatoRepository.find({
        where: {
          proximoContato: Between(inicioDoDia, fimDoDia),
          status: Not(StatusContato.INATIVO),
          tipoContato: TipoContato.LEAD,
        },
        relations: ["empresa", "usuarioCriador"],
      });

      console.log(`📋 Encontrados ${contatosHoje.length} contatos para HOJE`);

      // Notificar contatos de hoje
      for (const contato of contatosHoje) {
        await this.notificacaoService.criarNotificacao(
          contato.usuarioCriadorId,
          contato.id,
          contato.proximoContato,
          "🔔 Contato Agendado para Hoje",
          `Entre em contato com ${contato.nome} (${contato.empresa?.nome || "Sem empresa"}) hoje!`,
        );

        console.log(`✅ Notificação HOJE criada para ${contato.nome}`);
      }

      // ===== CONTATOS DE AMANHÃ =====
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);

      const inicioDeAmanha = new Date(amanha);
      inicioDeAmanha.setHours(0, 0, 0, 0);

      const fimDeAmanha = new Date(amanha);
      fimDeAmanha.setHours(23, 59, 59, 999);

      // Buscar contatos para AMANHÃ
      const contatosAmanha = await this.contatoRepository.find({
        where: {
          proximoContato: Between(inicioDeAmanha, fimDeAmanha),
          status: Not(StatusContato.INATIVO),
          tipoContato: TipoContato.LEAD,
        },
        relations: ["empresa", "usuarioCriador"],
      });

      console.log(
        `📋 Encontrados ${contatosAmanha.length} contatos para AMANHÃ`,
      );

      // Notificar contatos de amanhã
      for (const contato of contatosAmanha) {
        await this.notificacaoService.criarNotificacao(
          contato.usuarioCriadorId,
          contato.id,
          contato.proximoContato,
          "⏰ Lembrete: Contato Amanhã",
          `Prepare-se para entrar em contato com ${contato.nome} (${contato.empresa?.nome || "Sem empresa"}) amanhã.`,
        );

        console.log(`✅ Lembrete AMANHÃ criado para ${contato.nome}`);
      }

      console.log(
        `✅ [JOB] Notificações enviadas! Hoje: ${contatosHoje.length}, Amanhã: ${contatosAmanha.length}`,
      );
    } catch (error) {
      console.error("❌ [JOB] Erro ao notificar contatos diários:", error);
    }
  }

  /**
   * JOB #2: Verificar contatos que atingiram 5 tentativas + 3 dias → INATIVAR
   * Roda todos os dias às 10h da manhã
   */
  @Cron("0 10 * * *", { name: "verificar-contatos-inativos" })
  async verificarContatosInativos() {
    console.log("⚠️ [JOB] Verificando contatos para inativação...");

    const hoje = new Date();

    try {
      // ✅ NOVO: Buscar contatos que completaram Perfil 3 (15 tentativas) e não são inativos
      const contatos = await this.contatoRepository.find({
        where: {
          tentativasPerfil3: MoreThanOrEqual(5), // Completou o último perfil
          status: Not(StatusContato.INATIVO),
        },
        relations: ["empresa", "usuarioCriador"],
      });

      console.log(
        `📋 Encontrados ${contatos.length} contatos que completaram Perfil 3 (15 tentativas)`,
      );

      for (const contato of contatos) {
        if (!contato.ultimoContatoRealizado) {
          console.log(
            `⚠️ Contato ${contato.nome} sem data de último contato - pulando`,
          );
          continue;
        }

        // Calcular dias desde o último contato
        const diasDesdeUltimo = Math.floor(
          (hoje.getTime() - contato.ultimoContatoRealizado.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        const totalTentativas =
          (contato.tentativasPerfil1 || 0) +
          (contato.tentativasPerfil2 || 0) +
          (contato.tentativasPerfil3 || 0);

        console.log(
          `📊 ${contato.nome}: ${diasDesdeUltimo} dias desde último contato (${totalTentativas} tentativas nos 3 perfis)`,
        );

        if (diasDesdeUltimo >= 3) {
          // Marcar como inativo
          await this.contatoRepository.update(contato.id, {
            status: StatusContato.INATIVO,
            lead: LeadTemperatura.INATIVO,
          });

          // Criar notificação para o usuário responsável
          await this.notificacaoService.criarNotificacao(
            contato.usuarioCriadorId,
            contato.id,
            hoje,
            "⚠️ Contato Inativado Automaticamente",
            `${contato.nome} (${contato.empresa?.nome || "Sem empresa"}) foi marcado como inativo após completar os 3 perfis de tentativas (${totalTentativas} tentativas) sem resposta em 3 dias.`,
          );

          console.log(
            `🔴 ${contato.nome} marcado como INATIVO após 3 perfis completos`,
          );
        }
      }

      console.log("✅ [JOB] Verificação de inativos concluída!");
    } catch (error) {
      console.error("❌ [JOB] Erro ao verificar contatos inativos:", error);
    }
  }
}
