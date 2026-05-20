"use client";

import { useState } from "react";
import Navigation from "../../src/components/common/Navigation";
import {
  PageContainer,
  MainContent,
} from "../../src/components/common/Layout.styles";
import * as S from "./styles";

export default function ProjetosPage() {
  const [projetos] = useState({
    cadastro: [
      {
        id: 1,
        titulo: "Website Institucional",
        empresa: "TechCorp Solutions",
        prazo: "2024-02-15",
      },
      {
        id: 2,
        titulo: "Sistema de CRM",
        empresa: "Digital Marketing Pro",
        prazo: "2024-02-20",
      },
    ],
    contato: [
      {
        id: 3,
        titulo: "App Mobile",
        empresa: "Startup Innovation",
        prazo: "2024-02-10",
      },
    ],
    reuniao: [
      {
        id: 4,
        titulo: "E-commerce",
        empresa: "Retail Plus",
        prazo: "2024-02-08",
      },
    ],
    proposta: [
      {
        id: 5,
        titulo: "Landing Page",
        empresa: "Marketing Agency",
        prazo: "2024-01-30",
      },
    ],
    atendimento: [
      {
        id: 5,
        titulo: "Landing Page",
        empresa: "Marketing Agency",
        prazo: "2024-01-30",
      },
    ],
  });

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const columns = [
    { key: "cadastro", title: "Cadastrado", color: "#f59e0b" },
    { key: "reuniao", title: "Reunião", color: "#8b5cf6" },
    { key: "proposta", title: "Proposta", color: "#10b981" },
    { key: "atendimento", title: "Atendimento", color: "#8b5cf6" },
  ];

  return (
    <PageContainer>
      <S.ProjectContent>
        <S.PageTitle>Projetos</S.PageTitle>

        <S.KanbanBoard>
          {columns.map((column) => (
            <S.KanbanColumn key={column.key}>
              <S.ColumnHeader>
                <S.ColumnTitle>{column.title}</S.ColumnTitle>
                <S.ColumnCount>
                  {projetos[column.key as keyof typeof projetos].length}
                </S.ColumnCount>
              </S.ColumnHeader>

              {projetos[column.key as keyof typeof projetos].map((projeto) => (
                <S.ProjectCard key={projeto.id}>
                  <S.ProjectTitle>{projeto.titulo}</S.ProjectTitle>
                  <S.ProjectClient>{projeto.empresa}</S.ProjectClient>
                  <S.ProjectDeadline>
                    Prazo: {formatarData(projeto.prazo)}
                  </S.ProjectDeadline>
                </S.ProjectCard>
              ))}

              <S.AddButton>+ Adicionar Projeto</S.AddButton>
            </S.KanbanColumn>
          ))}
        </S.KanbanBoard>
      </S.ProjectContent>
    </PageContainer>
  );
}
