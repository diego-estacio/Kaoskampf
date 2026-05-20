import { Injectable, Logger } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Mapeamento de eventos Hubee → tipos do Planner
const EVENT_MAP: Record<string, string> = {
  "deal.won": "conversion",       // Proposta aprovada (ganha)
  "deal.created": "proposal",     // Proposta criada
  "contact.created": "contact",   // Novo contato cadastrado
  "call.completed": "call",       // Ligação / tentativa de contato realizada
  "meeting.scheduled": "meeting", // Reunião agendada
};

/**
 * Serviço responsável por notificar o Planner (Supabase)
 * sobre eventos que acontecem no Hubee.
 *
 * Quando uma atividade é inserida no Planner, os Triggers
 * do banco de dados processam automaticamente:
 *   - Atualizar DNA Score
 *   - Incrementar progresso de missões
 *   - Postar no Mural de Vitórias (se for conversão)
 *   - Atualizar streak do vendedor
 */
@Injectable()
export class PlannerWebhookService {
  private readonly logger = new Logger(PlannerWebhookService.name);
  private supabasePlanner: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL_DO_PLANNER;
    const supabaseServiceKey = process.env.SERVICE_ROLE_KEY_DO_PLANNER;

    if (!supabaseUrl || !supabaseServiceKey) {
      this.logger.warn(
        "⚠️ Variáveis SUPABASE_URL_DO_PLANNER ou SERVICE_ROLE_KEY_DO_PLANNER não configuradas. " +
        "Integração com o Planner ficará desabilitada.",
      );
    }

    this.supabasePlanner = createClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseServiceKey || "placeholder",
    );
  }

  /**
   * Verifica se a integração com o Planner está configurada.
   */
  private isConfigured(): boolean {
    return !!(
      process.env.SUPABASE_URL_DO_PLANNER &&
      process.env.SERVICE_ROLE_KEY_DO_PLANNER
    );
  }

  /**
   * Envia um evento do Hubee para o Planner.
   * O banco do Planner vai processar automaticamente via Triggers:
   * - Atualizar DNA Score
   * - Incrementar missões
   * - Postar no Mural de Vitórias (se for conversão)
   *
   * @param vendedorEmail - Email do vendedor no Hubee
   * @param evento - Tipo do evento (ex: 'deal.won', 'contact.created')
   * @param valor - Valor monetário associado ao evento (default: 0)
   * @param descricao - Descrição do evento
   */
  async notificarPlanner(
    vendedorEmail: string,
    evento: string,
    valor: number = 0,
    descricao: string = "",
  ): Promise<void> {
    // Se as variáveis não estão configuradas, apenas loga e retorna
    if (!this.isConfigured()) {
      this.logger.debug(
        `[Planner] Integração não configurada. Evento "${evento}" ignorado para ${vendedorEmail}.`,
      );
      return;
    }

    try {
      // 1. Descobrir o ID do vendedor no Planner pelo email
      const { data: sellerId, error: rpcError } = await this.supabasePlanner
        .rpc("get_seller_id_by_email", { seller_email: vendedorEmail });

      if (rpcError) {
        this.logger.error(
          `[Planner] Erro ao buscar vendedor ${vendedorEmail}:`,
          rpcError,
        );
        return;
      }

      if (!sellerId) {
        this.logger.warn(
          `[Planner] Vendedor ${vendedorEmail} não encontrado no Planner. Evento "${evento}" ignorado.`,
        );
        return;
      }

      // 2. Mapear o evento para o tipo do Planner
      const activityType = EVENT_MAP[evento];
      if (!activityType) {
        this.logger.warn(`[Planner] Evento "${evento}" não mapeado.`);
        return;
      }

      // 3. Inserir a atividade — os Triggers do banco fazem o resto!
      const { error: insertError } = await this.supabasePlanner
        .from("activities")
        .insert({
          seller_id: sellerId,
          type: activityType,
          value: valor,
          description: descricao || `Evento ${evento} registrado via Hubee`,
          date: new Date().toISOString().split("T")[0],
        });

      if (insertError) {
        this.logger.error(
          `[Planner] Erro ao inserir atividade "${evento}":`,
          insertError,
        );
      } else {
        this.logger.log(
          `[Planner] ✅ Evento "${evento}" registrado para ${vendedorEmail}`,
        );
      }
    } catch (error) {
      // Nunca deixar a falha no Planner quebrar o fluxo do Hubee
      this.logger.error(
        `[Planner] Erro inesperado ao notificar evento "${evento}":`,
        error,
      );
    }
  }
}
