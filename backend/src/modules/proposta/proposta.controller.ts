import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  HttpException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import {
  PropostaService,
  CriarPropostaDto,
  AtualizarPropostaDto,
} from "./proposta.service";
import { IaPropostaService } from "./ia-proposta.service";
import { Proposta, StatusProposta } from "../../entities/proposta.entity";

@Controller("propostas")
export class PropostaController {
  constructor(
    private propostaService: PropostaService,
    private iaPropostaService: IaPropostaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async listar(
    @Query("contatoId") contatoId?: string,
    @Query("empresaId") empresaId?: string,
  ): Promise<Proposta[]> {
    return this.propostaService.listarTodos({ contatoId, empresaId });
  }

  @UseGuards(JwtAuthGuard)
  @Get("contato/:contatoId")
  async listarPorContato(
    @Param("contatoId") contatoId: string,
  ): Promise<Proposta[]> {
    return this.propostaService.listarPorContato(contatoId);
  }

  @Get(":id")
  async buscarPorId(@Param("id") id: string): Promise<Proposta> {
    return this.propostaService.buscarPorId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async criar(
    @Body() dto: CriarPropostaDto,
    @Request() req,
  ): Promise<Proposta> {
    const usuarioId = req.user.id;
    return this.propostaService.criar(dto, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("ia/sugerir")
  async sugerirComIa(
    @Body() body: { descricao: string; marcaId?: number | null },
  ) {
    try {
      return await this.iaPropostaService.sugerirProposta(
        body.descricao,
        body.marcaId,
      );
    } catch (err: any) {
      if (err?.status === 429) {
        throw new HttpException(
          err?.isDailyQuota
            ? "Cota diária da API Gemini esgotada. Tente novamente amanhã."
            : "O serviço de IA está sobrecarregado. Aguarde alguns segundos e tente novamente.",
          429,
        );
      }
      throw new HttpException(
        err?.message || "Erro ao gerar sugestão com IA",
        500,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/duplicar")
  async duplicar(
    @Param("id") id: string,
    @Request() req,
  ): Promise<Proposta> {
    const usuarioId = req.user.id;
    return this.propostaService.duplicar(id, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async atualizar(
    @Param("id") id: string,
    @Body() dto: AtualizarPropostaDto,
  ): Promise<Proposta> {
    return this.propostaService.atualizar(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  async atualizarStatus(
    @Param("id") id: string,
    @Body() body: { status: StatusProposta },
  ): Promise<Proposta> {
    return this.propostaService.atualizarStatus(id, body.status);
  }
}
