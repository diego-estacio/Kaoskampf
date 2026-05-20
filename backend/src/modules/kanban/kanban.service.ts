import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { KanbanColuna } from "../../entities/kanban-coluna.entity";
import { Empresa } from "../../entities/empresa.entity";

@Injectable()
export class KanbanService {
  constructor(
    @InjectRepository(KanbanColuna)
    private kanbanColunaRepository: Repository<KanbanColuna>,
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
  ) {}

  // Buscar todas as colunas ativas do Kanban
  async buscarColunas(): Promise<KanbanColuna[]> {
    return this.kanbanColunaRepository.find({
      where: { ativa: true },
      order: { ordem: "ASC" },
    });
  }

  // Buscar o board completo (colunas + empresas)
  async buscarBoard(): Promise<any> {
    const colunas = await this.buscarColunas();

    const board = await Promise.all(
      colunas.map(async (coluna) => {
        const empresas = await this.empresaRepository.find({
          where: { kanbanColunaId: coluna.id },
          relations: ["contatos"],
          order: { posicaoKanban: "ASC" },
        });

        return {
          ...coluna,
          empresas,
        };
      }),
    );

    return board;
  }

  // Mover empresa entre colunas ou reordenar
  async moverEmpresa(
    empresaId: string,
    novaKanbanColunaId: string,
    novaPosicao: number,
  ): Promise<void> {
    const empresa = await this.empresaRepository.findOne({
      where: { id: empresaId },
    });

    if (!empresa) {
      throw new Error("Empresa não encontrada");
    }

    // Se mudou de coluna, reorganizar posições
    if (empresa.kanbanColunaId !== novaKanbanColunaId) {
      // Reorganizar coluna antiga
      await this.reorganizarColuna(
        empresa.kanbanColunaId,
        empresa.posicaoKanban,
      );

      // Fazer espaço na nova coluna
      await this.fazerEspacoNaColuna(novaKanbanColunaId, novaPosicao);
    } else {
      // Apenas reordenar na mesma coluna
      await this.reordenarNaColuna(
        novaKanbanColunaId,
        empresa.posicaoKanban,
        novaPosicao,
      );
    }

    // Atualizar empresa
    await this.empresaRepository.update(empresaId, {
      kanbanColunaId: novaKanbanColunaId,
      posicaoKanban: novaPosicao,
    });
  }

  // Criar nova coluna personalizada
  async criarColuna(nome: string, cor?: string): Promise<KanbanColuna> {
    const ultimaOrdem = await this.kanbanColunaRepository
      .createQueryBuilder("coluna")
      .select("MAX(coluna.ordem)", "maxOrdem")
      .getRawOne();

    const novaColuna = this.kanbanColunaRepository.create({
      nome,
      cor: cor || "#3b82f6",
      ordem: (ultimaOrdem?.maxOrdem || 0) + 1,
      editavel: true,
    });

    return this.kanbanColunaRepository.save(novaColuna);
  }

  // Atualizar coluna (apenas as editáveis)
  async atualizarColuna(id: string, nome: string, cor?: string): Promise<void> {
    const coluna = await this.kanbanColunaRepository.findOne({ where: { id } });

    if (!coluna?.editavel) {
      throw new Error("Esta coluna não pode ser editada");
    }

    await this.kanbanColunaRepository.update(id, { nome, cor });
  }

  // Helpers privados
  private async reorganizarColuna(
    colunaId: string,
    posicaoRemovida: number,
  ): Promise<void> {
    await this.empresaRepository
      .createQueryBuilder()
      .update(Empresa)
      .set({ posicaoKanban: () => "posicaoKanban - 1" })
      .where("kanbanColunaId = :colunaId AND posicaoKanban > :posicao", {
        colunaId,
        posicao: posicaoRemovida,
      })
      .execute();
  }

  private async fazerEspacoNaColuna(
    colunaId: string,
    novaPosicao: number,
  ): Promise<void> {
    await this.empresaRepository
      .createQueryBuilder()
      .update(Empresa)
      .set({ posicaoKanban: () => "posicaoKanban + 1" })
      .where("kanbanColunaId = :colunaId AND posicaoKanban >= :posicao", {
        colunaId,
        posicao: novaPosicao,
      })
      .execute();
  }

  private async reordenarNaColuna(
    colunaId: string,
    posicaoAntiga: number,
    novaPosicao: number,
  ): Promise<void> {
    if (posicaoAntiga < novaPosicao) {
      // Movendo para baixo
      await this.empresaRepository
        .createQueryBuilder()
        .update(Empresa)
        .set({ posicaoKanban: () => "posicaoKanban - 1" })
        .where(
          "kanbanColunaId = :colunaId AND posicaoKanban > :posicaoAntiga AND posicaoKanban <= :novaPosicao",
          { colunaId, posicaoAntiga, novaPosicao },
        )
        .execute();
    } else {
      // Movendo para cima
      await this.empresaRepository
        .createQueryBuilder()
        .update(Empresa)
        .set({ posicaoKanban: () => "posicaoKanban + 1" })
        .where(
          "kanbanColunaId = :colunaId AND posicaoKanban >= :novaPosicao AND posicaoKanban < :posicaoAntiga",
          { colunaId, posicaoAntiga, novaPosicao },
        )
        .execute();
    }
  }

  // Inicializar colunas padrão do sistema
  async inicializarColunasDefault(): Promise<void> {
    const count = await this.kanbanColunaRepository.count();

    if (count === 0) {
      const colunasDefault = [
        { nome: "Contato", ordem: 1, cor: "#10b981", editavel: false },
        { nome: "Reunião", ordem: 2, cor: "#f59e0b", editavel: false },
        { nome: "Proposta", ordem: 3, cor: "#3b82f6", editavel: false },
        { nome: "Atendimento", ordem: 4, cor: "#8b5cf6", editavel: false },
      ];

      for (const coluna of colunasDefault) {
        await this.kanbanColunaRepository.save(
          this.kanbanColunaRepository.create(coluna),
        );
      }
    }
  }
}
