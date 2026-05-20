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
import { EmpresaService, CriarEmpresaDto } from "./empresa.service";
import { Empresa } from "../../entities/empresa.entity";

@Controller("empresas")
@UseGuards(JwtAuthGuard)
export class EmpresaController {
  constructor(private empresaService: EmpresaService) {}

  @Post()
  async criar(@Body() criarEmpresaDto: CriarEmpresaDto): Promise<Empresa> {
    return this.empresaService.criar(criarEmpresaDto);
  }

  @Get()
  async buscarTodos(): Promise<Empresa[]> {
    return this.empresaService.buscarTodos();
  }

  @Get("kanban")
  async buscarParaKanban(): Promise<any[]> {
    return this.empresaService.buscarParaKanban();
  }

  @Get(":id")
  async buscarPorId(@Param("id") id: string): Promise<Empresa> {
    return this.empresaService.buscarPorId(id);
  }

  @Put(":id")
  async atualizar(
    @Param("id") id: string,
    @Body() dados: Partial<Empresa>,
  ): Promise<Empresa> {
    return this.empresaService.atualizar(id, dados);
  }

  @Delete(":id")
  async deletar(@Param("id") id: string): Promise<void> {
    return this.empresaService.deletar(id);
  }
}
