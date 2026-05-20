import { create } from "zustand";
import { notaService, Nota, CategoriaNota } from "../services/api/notaService";

interface NotaState {
  notas: Nota[];
  isLoading: boolean;
  error: string | null;

  // Actions
  buscarNotas: () => Promise<void>;
  criarNota: (titulo: string, texto: string, categoria: CategoriaNota) => Promise<void>;
  editarNota: (id: string, titulo: string, texto: string, categoria: CategoriaNota) => Promise<void>;
  deletarNota: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useNotaStore = create<NotaState>((set, get) => ({
  notas: [],
  isLoading: false,
  error: null,

  buscarNotas: async () => {
    try {
      set({ isLoading: true, error: null });
      const notas = await notaService.listar();
      set({ notas, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "Erro ao buscar notas" 
      });
    }
  },

  criarNota: async (titulo: string, texto: string, categoria: CategoriaNota) => {
    try {
      set({ isLoading: true, error: null });
      const novaNota = await notaService.criar(titulo, texto, categoria);
      const { notas } = get();
      set({ 
        notas: [novaNota, ...notas], 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "Erro ao criar nota" 
      });
      throw error;
    }
  },

  editarNota: async (id: string, titulo: string, texto: string, categoria: CategoriaNota) => {
    try {
      set({ isLoading: true, error: null });
      const notaAtualizada = await notaService.editar(id, titulo, texto, categoria);
      const { notas } = get();
      set({
        notas: notas.map((n) => (n.id === id ? notaAtualizada : n)),
        isLoading: false,
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "Erro ao editar nota" 
      });
      throw error;
    }
  },

  deletarNota: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await notaService.deletar(id);
      const { notas } = get();
      set({
        notas: notas.filter((n) => n.id !== id),
        isLoading: false,
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "Erro ao deletar nota" 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
