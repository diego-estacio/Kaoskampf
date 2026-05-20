"use client";

import React, { useState } from "react";
import * as S from "./MarcarContatoModal.styles";

interface MarcarContatoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (observacao: string, via: string) => Promise<void>;
  numeroTentativa: number;
}

const viaOptions = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "telefone", label: "Telefone" },
];

export default function MarcarContatoModal({
  isOpen,
  onClose,
  onConfirm,
  numeroTentativa,
}: MarcarContatoModalProps) {
  const [observacao, setObservacao] = useState("");
  const [via, setVia] = useState("whatsapp");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!observacao.trim()) {
      alert("Por favor, adicione uma observação sobre o contato.");
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(observacao, via);
      // Limpar campos
      setObservacao("");
      setVia("whatsapp");
      onClose();
    } catch (error) {
      console.error("Erro ao marcar contato:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNumeroExtenso = (num: number): string => {
    const numeros = [
      "Primeiro",
      "Segundo",
      "Terceiro",
      "Quarto",
      "Quinto",
      "Sexto",
      "Sétimo",
      "Oitavo",
      "Nono",
      "Décimo",
    ];
    return numeros[num - 1] || `${num}º`;
  };

  if (!isOpen) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalTitle>
            ✅ Marcar {getNumeroExtenso(numeroTentativa)} Contato
          </S.ModalTitle>
          <S.CloseButton onClick={onClose}>×</S.CloseButton>
        </S.ModalHeader>

        <S.ModalBody>
          <S.FormGroup>
            <S.Label>Via de contato:</S.Label>
            <S.Select
              value={via}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setVia(e.target.value)
              }
            >
              {viaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </S.Select>
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Observações sobre o contato:</S.Label>
            <S.Textarea
              value={observacao}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setObservacao(e.target.value)
              }
              placeholder="Ex: Cliente demonstrou interesse na proposta, pediu mais detalhes sobre preços..."
              rows={4}
            />
          </S.FormGroup>

          <S.PreviewBox>
            <S.PreviewLabel>📝 Preview da observação:</S.PreviewLabel>
            <S.PreviewText>
              {getNumeroExtenso(numeroTentativa)} contato realizado via{" "}
              {viaOptions.find((v) => v.value === via)?.label || via}.
              {observacao.trim() && ` Observação: ${observacao}`}
            </S.PreviewText>
          </S.PreviewBox>
        </S.ModalBody>

        <S.ModalFooter>
          <S.CancelButton onClick={onClose} disabled={isLoading}>
            Cancelar
          </S.CancelButton>
          <S.ConfirmButton onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Confirmar Marcação"}
          </S.ConfirmButton>
        </S.ModalFooter>
      </S.ModalContent>
    </S.ModalOverlay>
  );
}
