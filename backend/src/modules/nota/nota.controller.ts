import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { NotaService } from "./nota.service";
import { CreateNotaDto } from "./dto/create-nota.dto";
import { Nota } from "../../entities/nota.entity";

@UseGuards(JwtAuthGuard)
@Controller("notas")
export class NotaController {
  constructor(private readonly notaService: NotaService) {}

  @Post()
  async criar(
    @Body() dto: CreateNotaDto,
    @Request() req,
  ): Promise<Nota> {
    const autorId = req.user.id;
    return this.notaService.criar(dto, autorId);
  }

  @Get()
  async listar(@Request() req): Promise<Nota[]> {
    const autorId = req.user.id;
    return this.notaService.listarPorAutor(autorId);
  }

  @Get(":id")
  async buscarPorId(@Param("id") id: string, @Request() req): Promise<Nota> {
    const autorId = req.user.id;
    return this.notaService.buscarPorId(id, autorId);
  }

  @Delete(":id")
  async deletar(@Param("id") id: string, @Request() req): Promise<void> {
    const autorId = req.user.id;
    return this.notaService.deletar(id, autorId);
  }

  @Put(":id")
  async editar(
    @Param("id") id: string,
    @Body() dto: CreateNotaDto,
    @Request() req
  ): Promise<Nota> {
    const autorId = req.user.id;
    return this.notaService.editar(id, autorId, dto.titulo, dto.texto, dto.categoria);
  }
}
