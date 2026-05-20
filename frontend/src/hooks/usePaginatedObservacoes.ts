import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { Observacao } from "../types";

interface UsePaginatedObservacoesProps {
  contatoId: string;
  itemsPerPage?: number;
}

interface UsePaginatedObservacoesReturn {
  items: Observacao[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refresh: () => void;
  addObservacao: (texto: string) => Promise<void>;
}

export const usePaginatedObservacoes = ({
  contatoId,
  itemsPerPage = 5,
}: UsePaginatedObservacoesProps): UsePaginatedObservacoesReturn => {
  const [allItems, setAllItems] = useState<Observacao[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar todas as observações
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiService.buscarObservacoes(contatoId);
      setAllItems(data);
      // Não resetar página ao recarregar (apenas quando adicionar nova)
    } catch (err) {
      console.error("Erro ao carregar observações:", err);
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  }, [contatoId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cálculos de paginação
  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const items = allItems.slice(startIndex, endIndex);

  // Navegação
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // Adicionar nova observação
  const addObservacao = useCallback(
    async (texto: string) => {
      if (!texto.trim()) return;

      try {
        await apiService.criarObservacao(contatoId, texto.trim());
        await loadData(); // Recarregar lista
        setCurrentPage(1); // Voltar para página 1 (observação mais recente)
      } catch (err) {
        console.error("Erro ao adicionar observação:", err);
        throw err;
      }
    },
    [contatoId, loadData],
  );

  return {
    items,
    currentPage,
    totalPages,
    totalItems,
    loading,
    error,
    goToPage,
    nextPage,
    prevPage,
    refresh,
    addObservacao,
  };
};
