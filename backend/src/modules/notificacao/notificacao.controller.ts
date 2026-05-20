import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  UseGuards,
  Request,
} from "@nestjs/common";
import { NotificacaoService } from "./notificacao.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller("notificacoes")
@UseGuards(JwtAuthGuard)
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  // GET /notificacoes (pegando userId do token JWT)
  @Get()
  async buscarNotificacoes(@Request() req) {
    return this.notificacaoService.buscarNotificacoesUsuario(req.user.id);
  }

  // GET /notificacoes/count - retorna quantidade de notificações não visualizadas do usuário logado
  @Get("count")
  async contarNotificacoes(@Request() req) {
    const count = await this.notificacaoService.contarNotificacoesUsuario(
      req.user.id,
    );
    return { count };
  }

  // GET /notificacoes/usuario/:usuarioId (mantido para compatibilidade)
  @Get("usuario/:usuarioId")
  async buscarNotificacoesUsuario(@Param("usuarioId") usuarioId: string) {
    return this.notificacaoService.buscarNotificacoesUsuario(usuarioId);
  }

  // PATCH /notificacoes/:id/visualizada
  @Patch(":id/visualizada")
  async marcarComoVisualizada(@Param("id") notificacaoId: string) {
    await this.notificacaoService.marcarComoVisualizada(notificacaoId);
    return { message: "Notificação marcada como visualizada" };
  }

  // PATCH /notificacoes/:id/contato-realizado
  @Patch(":id/contato-realizado")
  async marcarContatoRealizado(@Param("id") notificacaoId: string) {
    await this.notificacaoService.marcarContatoRealizado(notificacaoId);
    return { message: "Contato marcado como realizado" };
  }
}
