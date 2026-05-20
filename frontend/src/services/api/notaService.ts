import { api } from "../api";

// CategoriaNota
export enum CategoriaNota {
  CADASTRO = 0,
  REUNIAO = 2,
  PROPOSTA = 3,
  ATENDIMENTO = 4,
}

export interface Nota {
  id: string;
  titulo: string;
  texto: string;
  categoria: CategoriaNota;
  autorId: string;
  criadaEm: string;
  atualizadaEm: string;
}

export const notaService = {
  listar: async (): Promise<Nota[]> => {
    const response = await api.get("/notas");
    return response.data;
  },

  criar: async (titulo: string, texto: string, categoria: CategoriaNota): Promise<Nota> => {
    const response = await api.post("/notas", { titulo, texto, categoria });
    return response.data;
  },

  editar: async (id: string, titulo: string, texto: string, categoria: CategoriaNota): Promise<Nota> => {
    const response = await api.put(`/notas/${id}`, { titulo, texto, categoria });
    return response.data;
  },

  deletar: async (id: string): Promise<void> => {
    await api.delete(`/notas/${id}`);
  },
};
