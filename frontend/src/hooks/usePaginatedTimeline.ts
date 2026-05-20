import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { Timeline } from "../types";
import { useAuthStore } from "../stores/authStore";

export type TimelineType = "geral" | "usuario" | "contato";

interface UsePaginatedTimelineProps {
  type: TimelineType;
  entityId?: string; // usuarioId ou contatoId (não usado para 'geral')
  itemsPerPage?: number;
}

interface UsePaginatedTimelineReturn {
  items: Timeline[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refresh: () => void;
}

export const usePaginatedTimeline = ({
  type,
  entityId,
  itemsPerPage = 5,
}: UsePaginatedTimelineProps): UsePaginatedTimelineReturn => {
  const [allItems, setAllItems] = useState<Timeline[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar todos os itens da API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Timeline[] = [];

      switch (type) {
        case "geral":
          data = await apiService.buscarTimelineRecente(); // Sem limite - pega todos
          break;
        case "usuario":
          if (!entityId)
            throw new Error("entityId é obrigatório para tipo 'usuario'");
          data = await apiService.buscarTimelineUsuario(entityId); // Sem limite
          break;
        case "contato":
          if (!entityId)
            throw new Error("entityId é obrigatório para tipo 'contato'");
          data = await apiService.buscarTimelineContato(entityId);
          break;
      }

      const { usuario: currentUser } = useAuthStore.getState();

      const filteredData = data.filter((item) => {
        if (!currentUser) return true;

        const isAdminOrMaster =
          currentUser.role === "ADMIN" || currentUser.role === "MASTER";

        if (isAdminOrMaster) {
          // Administradores veem atividades de todos os usuários
          return true;
        } else {
          // Membros normais veem apenas suas próprias atividades
          return item.usuarioId === currentUser.id;
        }
      });

      setAllItems(filteredData);
      setCurrentPage(1); // Reset para página 1 ao carregar novos dados
    } catch (err) {
      console.error("Erro ao carregar timeline:", err);
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  }, [type, entityId]);

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
  };
};
