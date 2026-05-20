import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Empresa, PorteEmpresa } from "../../entities/empresa.entity";
import { Contato } from "../../entities/contato.entity";
import { Marca } from "../../entities/marca.entity";

export interface CriarEmpresaDto {
  nome: string;
  porte?: PorteEmpresa;
  site?: string;
  marcaIds?: number[]; // IDs das marcas para associar
  observacoes?: string;
}

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
    @InjectRepository(Contato)
    private contatoRepository: Repository<Contato>,
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
  ) {}

  async criar(criarEmpresaDto: CriarEmpresaDto): Promise<Empresa> {
    const { marcaIds, ...dadosEmpresa } = criarEmpresaDto;

    // Criar empresa sem marcas primeiro
    const empresa = this.empresaRepository.create(dadosEmpresa);

    // Se tiver IDs de marcas, buscar e associar
    if (marcaIds && marcaIds.length > 0) {
      const marcas = await this.marcaRepository.findBy({ id: In(marcaIds) });
      empresa.marcas = marcas;
    }

    return this.empresaRepository.save(empresa);
  }

  async buscarTodos(): Promise<Empresa[]> {
    return this.empresaRepository.find({
      relations: ["contatos", "marcas"],
      order: { criadoEm: "DESC" },
    });
  }

  async buscarPorId(id: string): Promise<Empresa> {
    return this.empresaRepository.findOne({
      where: { id },
      relations: ["contatos", "marcas"],
    });
  }

  async atualizar(
    id: string,
    dados: Partial<Empresa> & { marcaIds?: number[] },
  ): Promise<Empresa> {
    const { marcaIds, ...dadosEmpresa } = dados;

    // Atualizar campos simples da empresa
    await this.empresaRepository.update(id, dadosEmpresa);

    // Se vierem marcaIds, atualizar relacionamento ManyToMany
    if (marcaIds !== undefined) {
      const empresa = await this.empresaRepository.findOne({
        where: { id },
        relations: ["marcas"],
      });

      if (empresa) {
        if (marcaIds.length > 0) {
          const marcas = await this.marcaRepository.findBy({ id: In(marcaIds) });
          empresa.marcas = marcas;
        } else {
          // Se array vazio, remover todas as marcas
          empresa.marcas = [];
        }

        await this.empresaRepository.save(empresa);
      }
    }

    return this.buscarPorId(id);
  }

  async deletar(id: string): Promise<void> {
    await this.empresaRepository.delete(id);
  }

  async atualizarStatusEmpresa(empresaId: string): Promise<void> {
    const contatos = await this.contatoRepository.find({
      where: { empresaId },
    });

    if (contatos.length > 0) {
      const maiorStatus = Math.max(...contatos.map((c) => c.status));
      await this.empresaRepository.update(empresaId, { status: maiorStatus });
    }
  }

  async buscarParaKanban(): Promise<any[]> {
    const empresas = await this.empresaRepository.find({
      relations: ["contatos"],
      order: { status: "ASC" },
    });

    return empresas.map((empresa) => ({
      id: empresa.id,
      nome: empresa.nome,
      status: empresa.status,
      contatos: empresa.contatos.length,
      ultimoContato:
        empresa.contatos.length > 0
          ? Math.max(
              ...empresa.contatos.map((c) =>
                new Date(c.atualizadoEm).getTime(),
              ),
            )
          : new Date(empresa.criadoEm).getTime(),
    }));
  }
}
