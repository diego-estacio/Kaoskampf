import { useState, useCallback } from "react";
import { apiService } from "../services/api";
import { Observacao } from "../types";

/**
 * Hook customizado para gerenciar observações de um contato
 * Centraliza operações CRUD de observações
 */
export const useObservacoes = (contatoId: string) => {
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);
  const [novaObservacao, setNovaObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega observações do contato
   */
  const loadObservacoes = useCallback(async () => {
    if (!contatoId) return;

    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Carregando observações do contato ${contatoId}...`);
      const observacoesCarregadas = await apiService.buscarObservacoes(
        contatoId
      );
      setObservacoes(observacoesCarregadas);
      console.log(`✅ ${observacoesCarregadas.length} observações carregadas`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar observações";
      console.error("❌ Erro ao carregar observações:", err);
      setError(errorMessage);

      // Fallback para dados mock em caso de erro
      setObservacoes([
        {
          id: "1",
          texto:
            "Primeiro contato realizado por telefone. Cliente demonstrou interesse nos serviços.",
          criadaEm: "2024-03-15T10:30:00Z",
          contatoId: contatoId,
          autorId: "mock-user-id",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [contatoId]);

  /**
   * Adiciona nova observação
   * @param texto Texto da observação
   */
  const addObservacao = useCallback(
    async (texto: string) => {
      if (!texto.trim() || !contatoId) return;

      try {
        console.log(`📝 Adicionando observação ao contato ${contatoId}...`);
        const novaObs = await apiService.criarObservacao(
          contatoId,
          texto.trim()
        );

        // Adiciona no início da lista (mais recente primeiro)
        setObservacoes((prev) => [novaObs, ...prev]);
        setNovaObservacao("");

        console.log("✅ Observação adicionada com sucesso");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao adicionar observação";
        console.error("❌ Erro ao adicionar observação:", err);
        setError(errorMessage);
        throw err;
      }
    },
    [contatoId]
  );

  /**
   * Adiciona observação com texto customizado (sem limpar campo de input)
   * Útil para observações automáticas geradas pelo sistema
   * @param texto Texto da observação
   */
  const addObservacaoCustomizada = useCallback(
    async (texto: string) => {
      if (!texto.trim() || !contatoId) return;

      try {
        console.log(
          `📝 Adicionando observação customizada ao contato ${contatoId}...`
        );
        const novaObs = await apiService.criarObservacao(
          contatoId,
          texto.trim()
        );

        // Adiciona no início da lista (mais recente primeiro)
        setObservacoes((prev) => [novaObs, ...prev]);

        console.log("✅ Observação customizada adicionada com sucesso");
        return novaObs;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao adicionar observação";
        console.error("❌ Erro ao adicionar observação customizada:", err);
        setError(errorMessage);
        throw err;
      }
    },
    [contatoId]
  );

  /**
   * Limpa o campo de nova observação
   */
  const clearNovaObservacao = useCallback(() => {
    setNovaObservacao("");
  }, []);

  /**
   * Limpa erros
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    observacoes,
    novaObservacao,
    loading,
    error,

    // Ações
    loadObservacoes,
    addObservacao,
    addObservacaoCustomizada,
    setNovaObservacao,
    clearNovaObservacao,
    clearError,
    setObservacoes,
  };
};
