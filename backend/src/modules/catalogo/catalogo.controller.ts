import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import {
  CatalogoService,
  CriarCatalogoItemDto,
  AtualizarCatalogoItemDto,
} from "./catalogo.service";
import { CatalogoItem } from "../../entities/catalogo-item.entity";

@Controller("catalogo")
@UseGuards(JwtAuthGuard)
export class CatalogoController {
  constructor(private catalogoService: CatalogoService) {}

  @Get()
  async listarTodos(@Query("tipo") tipo?: string): Promise<CatalogoItem[]> {
    return this.catalogoService.listarTodos(tipo);
  }

  @Get("marca/:marcaId")
  async listarPorMarca(
    @Param("marcaId") marcaId: string,
    @Query("tipo") tipo?: string,
  ): Promise<CatalogoItem[]> {
    return this.catalogoService.listarPorMarca(Number(marcaId), tipo);
  }

  @Get("marca/:marcaId/tipos")
  async listarTiposPorMarca(
    @Param("marcaId") marcaId: string,
  ): Promise<string[]> {
    return this.catalogoService.listarTiposPorMarca(Number(marcaId));
  }

  @Get("tipos")
  async listarTiposTodos(): Promise<string[]> {
    return this.catalogoService.listarTiposTodos();
  }

  @Post()
  async criar(@Body() data: CriarCatalogoItemDto): Promise<CatalogoItem> {
    return this.catalogoService.criar(data);
  }

  @Put(":id")
  async atualizar(
    @Param("id") id: string,
    @Body() data: AtualizarCatalogoItemDto,
  ): Promise<CatalogoItem> {
    return this.catalogoService.atualizar(id, data);
  }

  @Delete(":id")
  async remover(@Param("id") id: string): Promise<{ success: boolean }> {
    await this.catalogoService.remover(id);
    return { success: true };
  }
}
