import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { TimelineService } from "./timeline.service";
import { Timeline } from "../../entities/timeline.entity";
import { CriarTimelineDto } from "./dto/criar-timeline.dto";

@Controller("timeline")
@UseGuards(JwtAuthGuard)
export class TimelineController {
  constructor(private timelineService: TimelineService) {}

  @Post()
  async criar(@Body() criarTimelineDto: CriarTimelineDto): Promise<Timeline> {
    return this.timelineService.criar(criarTimelineDto);
  }

  @Get()
  async buscarRecentes(@Query("limite") limite?: number): Promise<Timeline[]> {
    return this.timelineService.buscarRecentes(limite || 50);
  }

  @Get("usuario/:usuarioId")
  async buscarPorUsuario(
    @Param("usuarioId") usuarioId: string,
    @Query("limite") limite?: number
  ): Promise<Timeline[]> {
    return this.timelineService.buscarPorUsuario(usuarioId, limite || 20);
  }

  @Get("contato/:contatoId")
  async buscarPorContato(
    @Param("contatoId") contatoId: string
  ): Promise<Timeline[]> {
    return this.timelineService.buscarPorContato(contatoId);
  }
}
