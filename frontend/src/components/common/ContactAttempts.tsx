"use client";

import React, { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import { Timeline, Contato } from "../../types";
import { formatDateTime, formatRelativeTime } from "../../utils/dateUtils";
import {
  calcularPerfilAtivo,
  calcularTentativasPerfil,
  formatarPerfilLabel,
  getStatusPerfil,
  calcularTotalTentativas,
} from "../../utils/contactUtils";
import {
  AttemptsContainer,
  AttemptsLabel,
  CirclesContainer,
  PerfilRow,
  PerfilLabel,
  Circle,
  AttemptsTimeline,
  TimelineItem,
  TimelineBulletColumn,
  TimelineCircle,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineMeta,
  TimelineDescription,
} from "./ContactAttempts.styles";

interface ContactAttemptsProps {
  contatoId: string;
  size?: "small" | "medium";
  showMode?: "card" | "details"; // ✅ Nova prop para controlar modo de exibição
  numeroContatos?: number; // ✅ Trigger para forçar refresh
  maxAttempts?: number; // Deprecated, manter para compatibilidade
}

const ContactAttempts: React.FC<ContactAttemptsProps> = ({
  contatoId,
  size = "medium",
  showMode = "details", // ✅ Padrão: mostrar 3 fileiras
  numeroContatos, // ✅ Recebe do pai para trigger refresh
}) => {
  const [attempts, setAttempts] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [contato, setContato] = useState<Contato | null>(null);

  const loadAttempts = React.useCallback(async () => {
    try {
      setLoading(true);

      // ✅ Buscar dados completos do contato
      const contatoData = await apiService.buscarContato(contatoId);
      setContato(contatoData);

      // Buscar timeline para tooltips detalhados
      const timeline = await apiService.buscarTimelineContato(contatoId);
      const contatoAttempts = timeline.filter(
        (item) =>
          item.atividade.toLowerCase().includes("contato realizado") ||
          item.atividade.toLowerCase().includes("ligação") ||
          item.atividade.toLowerCase().includes("reunião") ||
          item.atividade.toLowerCase().includes("email"),
      );
      setAttempts(contatoAttempts);
    } catch (error) {
      console.error("Erro ao carregar tentativas de contato:", error);
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  }, [contatoId]);

  useEffect(() => {
    loadAttempts();
  }, [loadAttempts, numeroContatos]); // ✅ Recarrega quando numeroContatos muda

  if (loading) {
    return (
      <AttemptsContainer>
        <AttemptsLabel>Carregando...</AttemptsLabel>
      </AttemptsContainer>
    );
  }

  if (!contato) {
    return (
      <AttemptsContainer>
        <AttemptsLabel>Erro ao carregar dados</AttemptsLabel>
      </AttemptsContainer>
    );
  }

  // ✅ **MODO CARD**: Mostrar apenas 1 fileira do perfil atual
  if (showMode === "card") {
    const perfilAtivo = calcularPerfilAtivo(contato);
    const tentativasAtual = calcularTentativasPerfil(contato, perfilAtivo);
    const statusPerfil = getStatusPerfil(contato, perfilAtivo);

    return (
      <AttemptsContainer>
        <AttemptsLabel>
          {formatarPerfilLabel(perfilAtivo)} - {tentativasAtual}/5 tentativas
        </AttemptsLabel>
        <CirclesContainer $completedCount={tentativasAtual} $total={5}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Circle
              key={`perfil-${perfilAtivo}-${index}`}
              $filled={index < tentativasAtual}
              $status={statusPerfil}
              $size={size}
              title={
                index < tentativasAtual
                  ? `Tentativa ${index + 1} realizada`
                  : "Tentativa pendente"
              }
            />
          ))}
        </CirclesContainer>
      </AttemptsContainer>
    );
  }

  // Ordenar tentativas cronologicamente (mais antigas primeiro)
  const sortedAttempts = [...attempts].sort((a, b) =>
    a.criadoEm.localeCompare(b.criadoEm),
  );

  return (
    <AttemptsContainer>
      <AttemptsLabel>Tentativas de Contato:</AttemptsLabel>

      {/* ✅ 3 Fileiras de Perfis */}
      {[1, 2, 3].map((perfil) => {
        const tentativasPerfil = calcularTentativasPerfil(contato, perfil);
        const statusPerfil = getStatusPerfil(contato, perfil);

        return (
          <PerfilRow key={perfil}>
            <PerfilLabel $status={statusPerfil}>
              {formatarPerfilLabel(perfil)} - {tentativasPerfil}/5
            </PerfilLabel>
            <CirclesContainer $completedCount={tentativasPerfil} $total={5}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Circle
                  key={`perfil-${perfil}-${index}`}
                  $filled={index < tentativasPerfil}
                  $status={statusPerfil}
                  $size={size}
                  title={
                    index < tentativasPerfil
                      ? `${formatarPerfilLabel(perfil)} - Tentativa ${
                          index + 1
                        } realizada`
                      : statusPerfil === "aguardando"
                        ? "Perfil aguardando ativação"
                        : "Tentativa pendente"
                  }
                />
              ))}
            </CirclesContainer>
          </PerfilRow>
        );
      })}

      {/* ✅ Timeline vertical das tentativas realizadas */}
      {sortedAttempts.length > 0 && (
        <AttemptsTimeline>
          {sortedAttempts.map((item, index) => {
            const isLast = index === sortedAttempts.length - 1;
            return (
              <TimelineItem key={item.id ?? index}>
                <TimelineBulletColumn>
                  <TimelineCircle $completed>✓</TimelineCircle>
                  <TimelineConnector $isLast={isLast} />
                </TimelineBulletColumn>
                <TimelineContent>
                  <TimelineTitle>{item.atividade}</TimelineTitle>
                  <TimelineMeta>
                    {formatDateTime(item.criadoEm)} ·{" "}
                    {formatRelativeTime(item.criadoEm)}
                  </TimelineMeta>
                  {item.descricao && (
                    <TimelineDescription>{item.descricao}</TimelineDescription>
                  )}
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </AttemptsTimeline>
      )}
    </AttemptsContainer>
  );
};
export default ContactAttempts;
