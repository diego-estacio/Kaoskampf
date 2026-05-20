import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { ENV } from "../config/env";

export interface KanbanColuna {
  id: string;
  nome: string;
  ordem: number;
  cor: string;
  ativa: boolean;
  editavel: boolean;
  empresas: Empresa[];
}

export interface Empresa {
  id: string;
  nome: string;
  porte: "pequeno" | "medio" | "grande";
  site?: string;
  marcas?: string;
  observacoes?: string;
  kanbanColunaId: string;
  posicaoKanban: number;
  contatos: Contato[];
  criadoEm: string;
}

export interface Contato {
  id: string;
  nome: string;
  cargo?: string;
  email?: string;
  telefone?: string;
  linkedin?: string;
}

import { create } from "zustand";
import { Empresa } from "../types";

interface KanbanState {
  // Estado
  colunas: KanbanColuna[];
  loading: boolean;
  error: string | null;

  // Ações
  carregarBoard: () => Promise<void>;
  moverEmpresa: (
    empresaId: string,
    novaKanbanColunaId: string,
    novaPosicao: number,
  ) => Promise<void>;
  criarColuna: (nome: string, cor?: string) => Promise<void>;
  atualizarColuna: (id: string, nome: string, cor?: string) => Promise<void>;
  reordenarColunas: (colunas: KanbanColuna[]) => void;

  // Helpers
  buscarEmpresaPorId: (empresaId: string) => Empresa | null;
  buscarColunaPorId: (colunaId: string) => KanbanColuna | null;
}

export const useKanbanStore = create<KanbanState>()(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    colunas: [],
    loading: false,
    error: null,

    // Carregar board do backend
    carregarBoard: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`${ENV.API_URL}/kanban/board`);
        if (!response.ok) throw new Error("Erro ao carregar board");

        const colunas = await response.json();
        set({ colunas, loading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Erro desconhecido",
          loading: false,
        });
      }
    },

    // Mover empresa entre colunas ou reordenar
    moverEmpresa: async (
      empresaId: string,
      novaKanbanColunaId: string,
      novaPosicao: number,
    ) => {
      const { colunas } = get();

      // Otimistic update - atualiza a UI imediatamente
      const novasColunas = colunas.map((coluna) => {
        // Remove empresa da coluna atual
        const empresasFiltradas = coluna.empresas.filter(
          (c) => c.id !== empresaId,
        );

        if (coluna.id === novaKanbanColunaId) {
          // Adiciona empresa na nova posição
          const empresa = get().buscarEmpresaPorId(empresaId);
          if (empresa) {
            const empresaAtualizada = {
              ...empresa,
              kanbanColunaId: novaKanbanColunaId,
              posicaoKanban: novaPosicao,
            };

            empresasFiltradas.splice(novaPosicao, 0, empresaAtualizada);

            // Reordena posições
            empresasFiltradas.forEach((c, index) => {
              c.posicaoKanban = index;
            });
          }
        }

        return { ...coluna, empresas: empresasFiltradas };
      });

      set({ colunas: novasColunas });

      // Sincroniza com backend
      try {
        const response = await fetch(`${ENV.API_URL}/kanban/mover-empresa`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            empresaId,
            novaKanbanColunaId,
            novaPosicao,
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao mover empresa");
        }
      } catch (error) {
        // Em caso de erro, recarrega o board
        get().carregarBoard();
        set({ error: "Erro ao mover empresa. Board recarregado." });
      }
    },

    // Criar nova coluna
    criarColuna: async (nome: string, cor = "#8b5cf6") => {
      try {
        const response = await fetch(`${ENV.API_URL}/kanban/colunas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, cor }),
        });

        if (!response.ok) throw new Error("Erro ao criar coluna");

        // Recarrega o board
        await get().carregarBoard();
      } catch (error) {
        set({ error: "Erro ao criar coluna" });
      }
    },

    // Atualizar coluna existente
    atualizarColuna: async (id: string, nome: string, cor?: string) => {
      try {
        const response = await fetch(`${ENV.API_URL}/kanban/colunas/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, cor }),
        });

        if (!response.ok) throw new Error("Erro ao atualizar coluna");

        // Atualiza localmente
        const { colunas } = get();
        const novasColunas = colunas.map((coluna) =>
          coluna.id === id
            ? { ...coluna, nome, cor: cor || coluna.cor }
            : coluna,
        );
        set({ colunas: novasColunas });
      } catch (error) {
        set({ error: "Erro ao atualizar coluna" });
      }
    },

    // Reordenar colunas (apenas localmente para UX)
    reordenarColunas: (colunas: KanbanColuna[]) => {
      set({ colunas });
    },

    // Helper: buscar empresa por ID
    buscarEmpresaPorId: (empresaId: string) => {
      const { colunas } = get();
      for (const coluna of colunas) {
        const empresa = coluna.empresas.find((c) => c.id === empresaId);
        if (empresa) return empresa;
      }
      return null;
    },

    // Helper: buscar coluna por ID
    buscarColunaPorId: (colunaId: string) => {
      const { colunas } = get();
      return colunas.find((c) => c.id === colunaId) || null;
    },
  })),
);
