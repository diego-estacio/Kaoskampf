import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Marca } from "../../entities/marca.entity";

@Injectable()
export class MarcaService {
  constructor(
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
  ) {}

  async criar(dadosMarca: Partial<Marca>): Promise<Marca> {
    const marca = this.marcaRepository.create(dadosMarca);
    return this.marcaRepository.save(marca);
  }

  async encontrarTodas(): Promise<Marca[]> {
    return this.marcaRepository.find({
      where: { ativa: true },
      order: { name: "ASC" },
    });
  }

  async encontrarPorId(id: number): Promise<Marca> {
    return this.marcaRepository.findOne({ where: { id } });
  }

  async atualizar(id: number, dadosMarca: Partial<Marca>): Promise<Marca> {
    await this.marcaRepository.update(id, dadosMarca);
    return this.encontrarPorId(id);
  }

  async remover(id: number): Promise<void> {
    await this.marcaRepository.update(id, { ativa: false });
  }

  async buscarEmpresasPorMarca(id: number) {
    const marca = await this.marcaRepository.findOne({
      where: { id },
      relations: ["empresas", "empresas.contatos"],
    });

    if (!marca) {
      throw new Error("Marca não encontrada");
    }

    return marca.empresas;
  }
}
