import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CatalogoItem } from "../../entities/catalogo-item.entity";

export interface CriarCatalogoItemDto {
  // Preferencialmente usar marcaIds (many-to-many). marcaId é mantido apenas por compatibilidade.
  marcaIds?: number[];
  marcaId?: number;
  tipo: string;
  especificacoes: string;
  descricao?: string;
  precoG: number;
  precoM?: number;
  precoP?: number;
  valorAdicionalG?: number;
  valorAdicionalM?: number;
  valorAdicionalP?: number;
  unidadeAdicional?: string;
  inclui?: string;
  naoInclui?: string;
  ativo?: boolean;
}

export interface AtualizarCatalogoItemDto extends Partial<CriarCatalogoItemDto> {}

@Injectable()
export class CatalogoService {
  constructor(
    @InjectRepository(CatalogoItem)
    private catalogoRepository: Repository<CatalogoItem>,
  ) {}

  async listarTodos(tipo?: string): Promise<CatalogoItem[]> {
    const qb = this.catalogoRepository.createQueryBuilder("item");

    if (tipo) {
      qb.where("item.tipo = :tipo", { tipo });
    }

    qb.orderBy("item.tipo", "ASC").addOrderBy("item.especificacoes", "ASC");

    return qb.getMany();
  }

  async listarPorMarca(
    marcaId: number,
    tipo?: string,
  ): Promise<CatalogoItem[]> {
    const qb = this.catalogoRepository
      .createQueryBuilder("item")
      .leftJoin("item.marcas", "marca")
      .where("marca.id = :marcaId", { marcaId });

    if (tipo) {
      qb.andWhere("item.tipo = :tipo", { tipo });
    }

    qb.orderBy("item.tipo", "ASC").addOrderBy("item.especificacoes", "ASC");

    return qb.getMany();
  }

  async listarTiposPorMarca(marcaId: number): Promise<string[]> {
    const rows = await this.catalogoRepository
      .createQueryBuilder("item")
      .select("DISTINCT item.tipo", "tipo")
      .leftJoin("item.marcas", "marca")
      .where("marca.id = :marcaId", { marcaId })
      .orderBy("item.tipo", "ASC")
      .getRawMany();

    return rows.map((r) => r.tipo as string);
  }

  async listarTiposTodos(): Promise<string[]> {
    const rows = await this.catalogoRepository
      .createQueryBuilder("item")
      .select("DISTINCT item.tipo", "tipo")
      .orderBy("item.tipo", "ASC")
      .getRawMany();

    return rows.map((r) => r.tipo as string);
  }

  async criar(data: CriarCatalogoItemDto): Promise<CatalogoItem> {
    const { marcaIds, marcaId, ...rest } = data;

    const marcaIdsToUse =
      marcaIds && marcaIds.length ? marcaIds : marcaId ? [marcaId] : [];

    const entity = this.catalogoRepository.create({
      ...rest,
      ativo: rest.ativo ?? true,
      marcas: marcaIdsToUse.map((id) => ({ id }) as any),
    });
    return this.catalogoRepository.save(entity);
  }

  async atualizar(
    id: string,
    data: AtualizarCatalogoItemDto,
  ): Promise<CatalogoItem> {
    const existing = await this.catalogoRepository.findOne({
      where: { id },
      relations: ["marcas"],
    });
    if (!existing) {
      throw new NotFoundException("Item de catálogo não encontrado");
    }
    const { marcaIds, marcaId, ...rest } = data;

    Object.assign(existing, rest);

    if (marcaIds !== undefined || marcaId !== undefined) {
      const ids =
        marcaIds && marcaIds.length ? marcaIds : marcaId ? [marcaId] : [];
      existing.marcas = ids.map((id) => ({ id }) as any);
    }
    return this.catalogoRepository.save(existing);
  }

  async remover(id: string): Promise<void> {
    await this.catalogoRepository.delete(id);
  }
}
