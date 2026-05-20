import { Controller, Get, Post, Patch, Body, Param } from "@nestjs/common";
import { KanbanService } from "./kanban.service";

@Controller("kanban")
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  // GET /kanban/board - Buscar board completo
  @Get("board")
  async buscarBoard() {
    return this.kanbanService.buscarBoard();
  }

  // GET /kanban/colunas - Buscar apenas as colunas
  @Get("colunas")
  async buscarColunas() {
    return this.kanbanService.buscarColunas();
  }

  // POST /kanban/colunas - Criar nova coluna
  @Post("colunas")
  async criarColuna(@Body() body: { nome: string; cor?: string }) {
    return this.kanbanService.criarColuna(body.nome, body.cor);
  }

  // PATCH /kanban/colunas/:id - Atualizar coluna
  @Patch("colunas/:id")
  async atualizarColuna(
    @Param("id") id: string,
    @Body() body: { nome: string; cor?: string },
  ) {
    await this.kanbanService.atualizarColuna(id, body.nome, body.cor);
    return { message: "Coluna atualizada com sucesso" };
  }

  // PATCH /kanban/mover-empresa - Mover empresa no board
  @Patch("mover-empresa")
  async moverEmpresa(
    @Body()
    body: {
      empresaId: string;
      novaKanbanColunaId: string;
      novaPosicao: number;
    },
  ) {
    await this.kanbanService.moverEmpresa(
      body.empresaId,
      body.novaKanbanColunaId,
      body.novaPosicao,
    );
    return { message: "Empresa movida com sucesso" };
  }

  // POST /kanban/inicializar - Inicializar colunas padrão
  @Post("inicializar")
  async inicializar() {
    await this.kanbanService.inicializarColunasDefault();
    return { message: "Colunas padrão inicializadas" };
  }
}
