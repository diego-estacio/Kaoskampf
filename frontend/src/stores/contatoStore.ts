import { create } from "zustand";
import {
  Contato,
  Empresa,
  FiltrosContato,
  LeadTemperatura,
  StatusContato,
} from "../types";
import { apiService } from "../services/api";

interface ContatoState {
  contatos: Contato[];
  empresas: Empresa[];
  contatoSelecionado: Contato | null;
  isLoading: boolean;
  error: string | null;
  filtros: FiltrosContato;

  // Actions
  buscarContatos: () => Promise<void>;
  buscarEmpresas: () => Promise<void>;
  criarContato: (dados: any) => Promise<void>;
  atualizarContato: (id: string, dados: any) => Promise<void>;
  marcarContato: (id: string, observacao?: string) => Promise<void>;
  selecionarContato: (contato: Contato | null) => void;
  filtrarContatos: (filtros: FiltrosContato) => Promise<void>;
  limparFiltros: () => void;
  clearError: () => void;
}

export const useContatoStore = create<ContatoState>((set, get) => ({
  contatos: [],
  empresas: [],
  contatoSelecionado: null,
  isLoading: false,
  error: null,
  filtros: {
    lead: [LeadTemperatura.MORNO], // Por padrão, apenas leads mornos
  },

  buscarContatos: async () => {
    try {
      set({ isLoading: true, error: null });
      const contatos = await apiService.buscarContatos();
      set({ contatos, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: "Erro ao buscar contatos",
      });
    }
  },

  buscarEmpresas: async () => {
    try {
      set({ isLoading: true, error: null });
      const empresas = await apiService.buscarEmpresas();
      set({ empresas, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: "Erro ao buscar empresas",
      });
    }
  },

  criarContato: async (dados: any) => {
    try {
      set({ isLoading: true, error: null });
      const novoContato = await apiService.criarContato(dados);
      const { contatos } = get();
      set({
        contatos: [novoContato, ...contatos],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: "Erro ao criar contato",
      });
      throw error;
    }
  },

  atualizarContato: async (id: string, dados: any) => {
    try {
      set({ isLoading: true, error: null });
      const contatoAtualizado = await apiService.atualizarContato(id, dados);
      const { contatos } = get();

      set({
        contatos: contatos.map((c) => (c.id === id ? contatoAtualizado : c)),
        contatoSelecionado: contatoAtualizado,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: "Erro ao atualizar contato",
      });
      throw error;
    }
  },

  marcarContato: async (id: string, observacao?: string) => {
    try {
      set({ isLoading: true, error: null });
      const contatoAtualizado = await apiService.marcarContato(id, observacao);
      const { contatos } = get();

      set({
        contatos: contatos.map((c) => (c.id === id ? contatoAtualizado : c)),
        contatoSelecionado: contatoAtualizado,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: "Erro ao marcar contato",
      });
      throw error;
    }
  },

  selecionarContato: (contato: Contato | null) => {
    set({ contatoSelecionado: contato });
  },

  filtrarContatos: async (filtros: FiltrosContato) => {
    try {
      set({ isLoading: true, error: null, filtros });
      const contatos = await apiService.filtrarContatos(filtros);
      set({ contatos, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: "Erro ao filtrar contatos",
      });
    }
  },

  limparFiltros: () => {
    const filtrosLimpos = { lead: [LeadTemperatura.MORNO] };
    set({ filtros: filtrosLimpos });
    get().filtrarContatos(filtrosLimpos);
  },

  clearError: () => set({ error: null }),
}));
