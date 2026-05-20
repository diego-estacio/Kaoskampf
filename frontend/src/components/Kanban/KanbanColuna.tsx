"use client";

import React from "react";
import styled from "styled-components";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColuna as KanbanColunaType } from "../../stores/kanbanStore";
import { EmpresaCard } from "./EmpresaCard";

const ColunaContainer = styled.div<{ $isDragOver: boolean }>`
  background: ${(props) => (props.$isDragOver ? "#f0f9ff" : "white")};
  border: 1px solid #2d2d4e")};
  border-radius: 12px;
  padding: 1rem;
  min-width: 280px;
  max-width: 320px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ColunaHeader = styled.div<{ $cor: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${(props) => props.$cor};
`;

const ColunaTitulo = styled.h3<{ $cor: string }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.$cor};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ContadorEmpresas = styled.span`
  background: #1a1a2e;
  color: #718096;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const EmpresasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #718096;
  font-size: 0.875rem;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  margin-top: 1rem;
`;

interface KanbanColunaProps {
  coluna: KanbanColunaType;
}

export function KanbanColuna({ coluna }: KanbanColunaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `coluna-${coluna.id}`,
  });

  const empresaIds = coluna.empresas.map((empresa) => empresa.id);

  return (
    <ColunaContainer ref={setNodeRef} $isDragOver={isOver}>
      <ColunaHeader $cor={coluna.cor}>
        <ColunaTitulo $cor={coluna.cor}>{coluna.nome}</ColunaTitulo>
        <ContadorEmpresas>{coluna.empresas.length}</ContadorEmpresas>
      </ColunaHeader>

      <SortableContext
        items={empresaIds}
        strategy={verticalListSortingStrategy}
      >
        <EmpresasList>
          {coluna.empresas.length === 0 ? (
            <EmptyState>Arraste empresas aqui</EmptyState>
          ) : (
            coluna.empresas.map((empresa) => (
              <EmpresaCard key={empresa.id} empresa={empresa} />
            ))
          )}
        </EmpresasList>
      </SortableContext>
    </ColunaContainer>
  );
}
