import { useState, useCallback } from "react";
import { Contato, carregarContatos } from "../utils/contatosUtils";

/**
 * Hook customizado para gerenciar lista de contatos
 * Centraliza loading states e operações de carregamento
 */
export const useContatos = () => {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega lista de contatos da API
   * @param showLoading Se deve mostrar loading state (padrão: true)
   */
  const loadContatos = useCallback(async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      console.log("🔄 Carregando contatos...");
      const contatosCarregados = await carregarContatos();
      setContatos(contatosCarregados);
      console.log(`✅ ${contatosCarregados.length} contatos carregados`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      console.error("❌ Erro ao carregar contatos:", err);
      setError(errorMessage);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Recarrega contatos sem mostrar loading
   * Útil para atualizações após operações
   */
  const reloadContatos = useCallback(async () => {
    await loadContatos(false);
  }, [loadContatos]);

  /**
   * Encontra um contato específico por ID
   * @param id ID do contato
   * @returns Contato encontrado ou null
   */
  const findContatoById = useCallback(
    (id: string): Contato | null => {
      return contatos.find((contato) => contato.id === id) || null;
    },
    [contatos]
  );

  /**
   * Atualiza um contato específico na lista local
   * @param contatoId ID do contato
   * @param updates Atualizações a aplicar
   */
  const updateContatoLocal = useCallback(
    (contatoId: string, updates: Partial<Contato>) => {
      setContatos((prev) =>
        prev.map((contato) =>
          contato.id === contatoId ? { ...contato, ...updates } : contato
        )
      );
    },
    []
  );

  return {
    // Estados
    contatos,
    loading,
    error,

    // Ações
    loadContatos,
    reloadContatos,
    findContatoById,
    updateContatoLocal,
    setContatos,
  };
};
