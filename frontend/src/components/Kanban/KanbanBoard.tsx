"use client";

import React from "react";
import styled from "styled-components";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KanbanColuna as KanbanColunaType } from "../../stores/kanbanStore";
import { KanbanColuna } from "./KanbanColuna";
import { EmpresaCard } from "./EmpresaCard";
import { useKanbanStore } from "../../stores/kanbanStore";

const BoardContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem 0;
  min-height: 70vh;

  /* Scrollbar customizada */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a2e;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #2d2d4e;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #718096;
  }
`;

interface KanbanBoardProps {
  colunas: KanbanColunaType[];
}

export function KanbanBoard({ colunas }: KanbanBoardProps) {
  const { moverEmpresa } = useKanbanStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeEmpresa, setActiveEmpresa] = React.useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Encontrar a empresa sendo arrastada
    for (const coluna of colunas) {
      const empresa = coluna.empresas.find((c) => c.id === active.id);
      if (empresa) {
        setActiveEmpresa(empresa);
        break;
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Se está sendo arrastado sobre uma coluna
    if (overId.startsWith("coluna-")) {
      const novaColunaId = overId.replace("coluna-", "");
      const colunaDestino = colunas.find((c) => c.id === novaColunaId);

      if (colunaDestino) {
        // Posiciona no final da coluna
        const novaPosicao = colunaDestino.empresas.length;
        moverEmpresa(activeId, novaColunaId, novaPosicao);
      }
    }

    // Se está sendo arrastado sobre outra empresa
    if (overId.startsWith("empresa-")) {
      const empresaDestinoId = overId.replace("empresa-", "");

      // Encontrar a coluna e posição da empresa destino
      for (const coluna of colunas) {
        const empresaIndex = coluna.empresas.findIndex(
          (c) => c.id === empresaDestinoId,
        );
        if (empresaIndex >= 0) {
          moverEmpresa(activeId, coluna.id, empresaIndex);
          break;
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setActiveEmpresa(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <BoardContainer>
        {colunas.map((coluna) => (
          <KanbanColuna key={coluna.id} coluna={coluna} />
        ))}
      </BoardContainer>

      <DragOverlay>
        {activeEmpresa ? (
          <EmpresaCard empresa={activeEmpresa} isDragging={true} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
