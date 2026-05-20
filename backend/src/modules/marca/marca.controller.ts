import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { MarcaService } from "./marca.service";
import { Marca } from "../../entities/marca.entity";

@Controller("marcas")
@UseGuards(JwtAuthGuard)
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @Post()
  async criar(@Body() dadosMarca: Partial<Marca>): Promise<Marca> {
    return this.marcaService.criar(dadosMarca);
  }

  @Get()
  async listarTodas(): Promise<Marca[]> {
    return this.marcaService.encontrarTodas();
  }

  @Get(":id")
  async buscarPorId(@Param("id") id: number): Promise<Marca> {
    return this.marcaService.encontrarPorId(id);
  }

  @Put(":id")
  async atualizar(
    @Param("id") id: number,
    @Body() dadosMarca: Partial<Marca>,
  ): Promise<Marca> {
    return this.marcaService.atualizar(id, dadosMarca);
  }

  @Delete(":id")
  async remover(@Param("id") id: number): Promise<void> {
    return this.marcaService.remover(id);
  }

  @Get(":id/empresas")
  async buscarEmpresas(@Param("id") id: number) {
    return this.marcaService.buscarEmpresasPorMarca(id);
  }
}
