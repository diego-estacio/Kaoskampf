import { useState, useCallback, useEffect, useRef } from "react";
import { apiService } from "../services/api";
import { NotificacaoContato } from "../types";

/**
 * Hook customizado para gerenciar notificações
 * Centraliza operações de notificações com atualização automática
 */
export const useNotificacoes = () => {
  const [notificacoes, setNotificacoes] = useState<NotificacaoContato[]>([]);
  const [notificacoesCount, setNotificacoesCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Carrega apenas o contador de notificações (query leve para polling)
   */
  const loadNotificacoesCount = useCallback(async () => {
    try {
      const count = await apiService.contarNotificacoes();
      setNotificacoesCount(count);
    } catch (err) {
      console.error("❌ Erro ao carregar contador de notificações:", err);
    }
  }, []);

  /**
   * Carrega notificações completas (chamado quando abre dropdown)
   */
  const loadNotificacoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const notifications = await apiService.buscarNotificacoes();
      setNotificacoes(notifications);
      setNotificacoesCount(notifications.length);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar notificações";
      console.error("❌ Erro ao carregar notificações:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deleta notificação (remove do DB e atualiza interface)
   */
  const deletarNotificacao = useCallback(
    async (notificacaoId: string) => {
      try {
        // Remove da interface imediatamente (otimistic update)
        setNotificacoes((prev) =>
          prev.filter((notif) => notif.id !== notificacaoId),
        );
        setNotificacoesCount((prev) => Math.max(0, prev - 1));

        // Deleta do backend
        await apiService.deletarNotificacao(notificacaoId);

        console.log(`✅ Notificação ${notificacaoId} deletada com sucesso`);
      } catch (err) {
        console.error("❌ Erro ao deletar notificação:", err);
        // Recarrega em caso de erro
        await loadNotificacoes();
        throw err;
      }
    },
    [loadNotificacoes],
  );

  /**
   * Marca notificação como visualizada
   */
  const marcarComoVisualizada = useCallback(async (notificacaoId: string) => {
    try {
      await apiService.marcarNotificacaoVisualizada(notificacaoId);

      // Remove da lista local (já foi visualizada)
      setNotificacoes((prev) =>
        prev.filter((notif) => notif.id !== notificacaoId),
      );
      setNotificacoesCount((prev) => Math.max(0, prev - 1));

      console.log(`✅ Notificação ${notificacaoId} marcada como visualizada`);
    } catch (err) {
      console.error("❌ Erro ao marcar notificação:", err);
      throw err;
    }
  }, []);

  /**
   * Inicia polling automático apenas do contador (query leve)
   */
  const startPolling = useCallback(
    (intervalMs: number = 300000) => {
      // 5 minutos por padrão
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        loadNotificacoesCount();
      }, intervalMs);
    },
    [loadNotificacoesCount],
  );

  /**
   * Para polling automático
   */
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Carrega contador inicial e setup de eventos
  useEffect(() => {
    // Carrega contador inicial
    loadNotificacoesCount();

    // Window focus - atualiza contador quando usuário volta para a aba
    const handleFocus = () => {
      loadNotificacoesCount();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      stopPolling();
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadNotificacoesCount, stopPolling]);

  return {
    notificacoes,
    notificacoesCount,
    loading,
    error,
    loadNotificacoes,
    loadNotificacoesCount,
    deletarNotificacao,
    marcarComoVisualizada,
    startPolling,
    stopPolling,
  };
};
