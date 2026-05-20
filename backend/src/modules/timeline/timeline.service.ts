import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Timeline, TipoAtividade } from "../../entities/timeline.entity";
import { CriarTimelineDto } from "./dto/criar-timeline.dto";

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(Timeline)
    private timelineRepository: Repository<Timeline>,
  ) {}

  async criar(criarTimelineDto: CriarTimelineDto): Promise<Timeline> {
    const timeline = this.timelineRepository.create(criarTimelineDto);
    return await this.timelineRepository.save(timeline);
  }

  async registrar(
    usuarioId: string,
    contatoId: string,
    atividade: string,
    tipo: TipoAtividade,
    descricao?: string,
  ): Promise<Timeline> {
    const timeline = this.timelineRepository.create({
      usuarioId,
      contatoId,
      atividade,
      tipo,
      descricao,
    });
    return await this.timelineRepository.save(timeline);
  }

  async buscarRecentes(limite: number = 50): Promise<Timeline[]> {
    return this.timelineRepository.find({
      relations: ["usuario", "contato", "contato.empresa"],
      order: { criadoEm: "DESC" },
      take: limite,
    });
  }

  async buscarPorUsuario(
    usuarioId: string,
    limite: number = 20,
  ): Promise<Timeline[]> {
    return this.timelineRepository.find({
      where: { usuarioId },
      relations: ["contato", "contato.empresa"],
      order: { criadoEm: "DESC" },
      take: limite,
    });
  }

  async buscarPorContato(contatoId: string): Promise<Timeline[]> {
    return this.timelineRepository.find({
      where: { contatoId },
      relations: ["usuario"],
      order: { criadoEm: "ASC" },
    });
  }
}
