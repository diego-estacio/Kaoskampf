"use client";

import React from "react";
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Empresa } from "../../stores/kanbanStore";

const CardContainer = styled.div<{ $isDragging?: boolean }>`
  background: #1a1a2e;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  padding: 1rem;
  cursor: grab;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
  transform-origin: top left;

  &:hover {
    border-color: #2d2d4e;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    cursor: grabbing;
  }
`;

const EmpresaNome = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
`;

const EmpresaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

const InfoItem = styled.span`
  font-size: 0.75rem;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PorteBadge = styled.span<{ $porte: string }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;

  ${(props) => {
    switch (props.$porte) {
      case "pequeno":
        return "background: #dcfce7; color: #166534;";
      case "medio":
        return "background: #fef3c7; color: #92400e;";
      case "grande":
        return "background: #dbeafe; color: #1e40af;";
      default:
        return "background: #1a1a2e; color: #718096;";
    }
  }}
`;

const ContatosInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #1e1e3a;
`;

const ContatosCount = styled.span`
  font-size: 0.75rem;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DataCriacao = styled.span`
  font-size: 0.625rem;
  color: #718096;
`;

interface EmpresaCardProps {
  empresa: Empresa;
  isDragging?: boolean;
}

export function EmpresaCard({ empresa, isDragging = false }: EmpresaCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: empresa.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <CardContainer
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      {...attributes}
      {...listeners}
    >
      <EmpresaNome>{empresa.nome}</EmpresaNome>

      <EmpresaInfo>
        <InfoItem>
          🏢
          <PorteBadge $porte={empresa.porte}>{empresa.porte}</PorteBadge>
        </InfoItem>

        {empresa.site && <InfoItem>🌐 {empresa.site}</InfoItem>}

        {empresa.marcas && (
          <InfoItem>
            🏷️ {empresa.marcas.substring(0, 30)}
            {empresa.marcas.length > 30 ? "..." : ""}
          </InfoItem>
        )}
      </EmpresaInfo>

      <ContatosInfo>
        <ContatosCount>
          👥 {empresa.contatos?.length || 0} contatos
        </ContatosCount>

        <DataCriacao>{formatarData(empresa.criadoEm)}</DataCriacao>
      </ContatosInfo>
    </CardContainer>
  );
}
