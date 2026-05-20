import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Nota } from "../../entities/nota.entity";
import { CreateNotaDto } from "./dto/create-nota.dto";

@Injectable()
export class NotaService {
  constructor(
    @InjectRepository(Nota)
    private notaRepository: Repository<Nota>,
  ) {}

  async criar(dto: CreateNotaDto, autorId: string): Promise<Nota> {
    const novaNota = this.notaRepository.create({
      ...dto,
      autorId,
    });
    return this.notaRepository.save(novaNota);
  }

  async listarPorAutor(autorId: string): Promise<Nota[]> {
    return this.notaRepository.find({
      where: { autorId },
      order: { criadaEm: "DESC" },
    });
  }

  async buscarPorId(id: string, autorId: string): Promise<Nota> {
    const nota = await this.notaRepository.findOne({ where: { id, autorId } });
    if (!nota) {
      throw new NotFoundException("Nota não encontrada");
    }
    return nota;
  }

  async editar(id: string, autorId: string, titulo: string, texto: string, categoria: number): Promise<Nota> {
    const nota = await this.buscarPorId(id, autorId);
    nota.titulo = titulo;
    nota.texto = texto;
    nota.categoria = categoria;
    return this.notaRepository.save(nota);
  }

  async deletar(id: string, autorId: string): Promise<void> {
    const nota = await this.buscarPorId(id, autorId);
    await this.notaRepository.remove(nota);
  }
}
