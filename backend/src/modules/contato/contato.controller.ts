import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import {
  ContatoService,
  CriarContatoDto,
  AtualizarContatoDto,
} from "./contato.service";
import {
  Contato,
  StatusContato,
  LeadTemperatura,
  TipoContato,
} from "../../entities/contato.entity";

@Controller("contatos")
@UseGuards(JwtAuthGuard)
export class ContatoController {
  constructor(private contatoService: ContatoService) {}

  @Post()
  async criar(
    @Body() criarContatoDto: CriarContatoDto,
    @Request() req,
  ): Promise<Contato> {
    criarContatoDto.usuarioCriadorId = req.user.id;
    return this.contatoService.criar(criarContatoDto);
  }

  @Get()
  async buscarTodos(): Promise<Contato[]> {
    return this.contatoService.buscarTodos();
  }

  @Get("filtrar")
  async filtrar(
    @Query("nome") nome?: string,
    @Query("empresaId") empresaId?: string,
    @Query("status") status?: string,
    @Query("lead") lead?: string,
  ): Promise<Contato[]> {
    const filtros: any = {};

    if (nome) filtros.nome = nome;
    if (empresaId) filtros.empresaId = empresaId;
    if (status)
      filtros.status = status
        .split(",")
        .map((s) => parseInt(s)) as StatusContato[];
    if (lead) filtros.lead = lead.split(",") as LeadTemperatura[];

    return this.contatoService.filtrar(filtros);
  }

  @Get("proximos/:dias")
  async buscarProximosContatos(
    @Param("dias") dias: number,
  ): Promise<Contato[]> {
    return this.contatoService.buscarProximosContatos(dias);
  }

  // Notificações - DEVE vir ANTES de @Get(":id")
  @Get("notificacoes")
  async buscarNotificacoes(@Request() req) {
    // Redireciona para o NotificacaoService que busca da tabela real
    // Retorna notificações montadas dinamicamente baseadas em contatos atrasados
    return this.contatoService.buscarNotificacoesPendentes(req.user.id);
  }

  @Get(":id")
  async buscarPorId(@Param("id") id: string): Promise<Contato> {
    return this.contatoService.buscarPorId(id);
  }

  @Put(":id")
  async atualizar(
    @Param("id") id: string,
    @Body() dados: AtualizarContatoDto,
  ): Promise<Contato> {
    return this.contatoService.atualizar(id, dados);
  }

  @Put(":id/marcar-contato")
  async marcarContato(
    @Param("id") id: string,
    @Body() body: { observacao?: string },
    @Request() req,
  ): Promise<Contato> {
    return this.contatoService.marcarContato(id, req.user.id, body.observacao);
  }

  // Observações
  @Post(":id/observacoes")
  async criarObservacao(
    @Param("id") contatoId: string,
    @Body() body: { texto: string },
    @Request() req,
  ) {
    return this.contatoService.criarObservacao(
      contatoId,
      body.texto,
      req.user.id,
    );
  }

  @Get(":id/observacoes")
  async buscarObservacoes(@Param("id") contatoId: string) {
    return this.contatoService.buscarObservacoes(contatoId);
  }

  // Atualizar status
  @Patch(":id/status")
  async atualizarStatus(
    @Param("id") id: string,
    @Body() body: { status: string },
  ): Promise<Contato> {
    return this.contatoService.atualizarStatus(id, body.status);
  }

  // Atualizar tipo do contato (lead ou cliente)
  @Patch(":id/tipo")
  async atualizarTipoContato(
    @Param("id") id: string,
    @Body() body: { tipoContato: TipoContato },
  ): Promise<Contato> {
    return this.contatoService.atualizarTipoContato(id, body.tipoContato);
  }

  // Endpoint utilitário/temporário para recalcular lead e tipoContato
  // com base no status atual (útil após alterações via SQL/migrations)
  @Post("recalcular-lead-tipo")
  async recalcularLeadETipoContato() {
    return this.contatoService.recalcularLeadETipoContato();
  }

  @Delete(":id")
  async remover(@Param("id") id: string) {
    await this.contatoService.remover(id);
    return { success: true };
  }
}
