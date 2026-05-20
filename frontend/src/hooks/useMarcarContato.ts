import { useState } from "react";
import { apiService } from "../services/api";
import { Contato } from "../utils/contatosUtils";
import {
  calcularProximaTentativa,
  formatarObservacaoContato,
} from "../utils/contactUtils";

/**
 * Hook customizado para gerenciar marcação de contatos
 * Centraliza toda a lógica relacionada à modal de marcar contato
 */
export const useMarcarContato = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numeroTentativa, setNumeroTentativa] = useState(1);
  const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(
    null,
  );

  /**
   * Abre a modal de marcar contato
   * @param contato Contato a ser marcado
   */
  const handleOpenModal = (contato: Contato) => {
    const tentativas = calcularProximaTentativa(contato.numeroContatos);
    setNumeroTentativa(tentativas);
    setContatoSelecionado(contato);
    setIsModalOpen(true);
  };

  /**
   * Fecha a modal e limpa estados
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContatoSelecionado(null);
    setNumeroTentativa(1);
  };

  /**
   * Confirma marcação de contato com optimistic update
   * @param observacao Texto da observação
   * @param via Canal utilizado para contato
   * @param onOptimisticUpdate Callback executado ANTES (optimistic update)
   * @param onSuccess Callback executado DEPOIS se sucesso
   * @param onError Callback executado se falhar (para reverter)
   */
  const handleConfirmarMarcacao = async (
    observacao: string,
    via: string,
    onOptimisticUpdate?: () => void,
    onSuccess?: () => Promise<void>,
    onError?: () => void,
  ) => {
    if (!contatoSelecionado) {
      throw new Error("Nenhum contato selecionado");
    }

    try {
      console.log("📞 Marcando contato realizado:", contatoSelecionado.nome);

      // 1. OPTIMISTIC UPDATE - Executar ANTES de chamar backend
      if (onOptimisticUpdate) {
        onOptimisticUpdate();
      }

      // 2. Marcar o contato no backend
      await apiService.marcarContato(
        contatoSelecionado.id,
        "Contato realizado",
      );

      // 3. Gerar e adicionar observação formatada
      const textoObservacao = formatarObservacaoContato(
        numeroTentativa,
        via,
        observacao,
      );

      await apiService.criarObservacao(contatoSelecionado.id, textoObservacao);

      // 4. Executar callback de sucesso DEPOIS (para recarregar dados sincronizados)
      if (onSuccess) {
        await onSuccess();
      }

      // 5. Fechar modal e limpar estado
      handleCloseModal();

      console.log("✅ Contato marcado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao marcar contato:", error);

      // Reverter optimistic update em caso de erro
      if (onError) {
        onError();
      }

      throw error;
    }
  };

  return {
    // Estados
    isModalOpen,
    numeroTentativa,
    contatoSelecionado,

    // Ações
    handleOpenModal,
    handleCloseModal,
    handleConfirmarMarcacao,
    setIsModalOpen,
  };
};
