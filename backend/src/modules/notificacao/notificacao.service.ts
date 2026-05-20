import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual } from "typeorm";
import { Notificacao } from "../../entities/notificacao.entity";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class NotificacaoService {
  constructor(
    @InjectRepository(Notificacao)
    private notificacaoRepository: Repository<Notificacao>,
  ) {}

  // Buscar notificações do usuário (as 10 mais recentes não visualizadas)
  async buscarNotificacoesUsuario(usuarioId: string): Promise<Notificacao[]> {
    return this.notificacaoRepository.find({
      where: { usuarioId, visualizada: false },
      relations: ["contato"], // Removido "contato.empresa" para evitar eager loading de marcas
      order: { criadaEm: "DESC" },
      take: 10,
    });
  }

  // Contar notificações não visualizadas do usuário (para badge leve)
  async contarNotificacoesUsuario(usuarioId: string): Promise<number> {
    return this.notificacaoRepository.count({
      where: { usuarioId, visualizada: false },
    });
  }

  // Marcar notificação como visualizada
  async marcarComoVisualizada(notificacaoId: string): Promise<void> {
    await this.notificacaoRepository.update(notificacaoId, {
      visualizada: true,
    });
  }

  // Marcar contato como realizado através da notificação
  async marcarContatoRealizado(notificacaoId: string): Promise<void> {
    await this.notificacaoRepository.update(notificacaoId, {
      contatoRealizado: true,
      dataContatoRealizado: new Date(),
      visualizada: true,
    });

    // Aqui você pode adicionar lógica para:
    // 1. Incrementar numeroContatos no contato
    // 2. Recalcular próximo contato
    // 3. Registrar na timeline
  }

  async removerPorContato(contatoId: string): Promise<void> {
    await this.notificacaoRepository.delete({ contatoId });
  }

  // Criar notificação automática
  async criarNotificacao(
    usuarioId: string,
    contatoId: string,
    dataLimiteContato: Date,
    titulo: string,
    descricao?: string,
  ): Promise<Notificacao> {
    const notificacao = this.notificacaoRepository.create({
      usuarioId,
      contatoId,
      dataLimiteContato,
      titulo,
      descricao,
    });

    return this.notificacaoRepository.save(notificacao);
  }

  // Método para gerar notificações automáticas (pode ser chamado por cron job futuramente)
  async gerarNotificacoesAutomaticas(): Promise<void> {
    // Lógica para:
    // 1. Buscar contatos que precisam de notificação
    // 2. Verificar configuração do usuário (diasAntesNotificacao)
    // 3. Criar notificações automáticas
    console.log("Gerando notificações automáticas...");
  }

  // Remover notificações visualizadas com mais de 30 dias
  @Cron(CronExpression.EVERY_DAY_AT_2AM, { name: "limpar-notificacoes-antigas" })
  async limparNotificacoesAntigasLidas(): Promise<void> {
    const agora = new Date();
    const limite = new Date(agora);
    limite.setDate(limite.getDate() - 30);

    try {
      const resultado = await this.notificacaoRepository.delete({
        visualizada: true,
        criadaEm: LessThanOrEqual(limite),
      });

      if (resultado.affected && resultado.affected > 0) {
        console.log(
          `🧹 [JOB] Limpeza de notificações: ${resultado.affected} notificações lidas com mais de 30 dias removidas.`,
        );
      } else {
        console.log(
          "🧹 [JOB] Limpeza de notificações: nenhuma notificação lida com mais de 30 dias encontrada.",
        );
      }
    } catch (error) {
      console.error(
        "❌ [JOB] Erro ao limpar notificações lidas antigas:",
        error,
      );
    }
  }
}
