import styled from "styled-components";

export const AttemptsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.75rem 0;
`;

export const AttemptsLabel = styled.span`
  font-size: 1rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
  margin: 0.5rem 0;
`;

export const CirclesContainer = styled.div<{
  $completedCount: number;
  $total: number;
}>`
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.25rem;
  width: 90%;

  /* Linha de conexão por trás das etapas (verde até a última concluída, cinza depois) */
  &::before {
    content: "";
    position: absolute;
    left: 0.9rem;
    right: 0.9rem;
    top: 50%;
    height: 3px;
    z-index: 0;

    ${({ $completedCount, $total }) => {
      const clampedTotal = Math.max($total || 1, 1);
      const steps = Math.max(clampedTotal - 1, 1);
      const completedSegments = Math.max($completedCount - 1, 0);
      const progress = Math.min(completedSegments / steps, 1);
      const percent = progress * 100;

      return `background: linear-gradient(
        90deg,
        var(--color-btn-success) 0%,
        var(--color-btn-success) ${percent}%,
        var(--color-border-medium) ${percent}%,
        var(--color-border-medium) 100%
      );`;
    }}
  }
`;

export const PerfilRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

export const PerfilLabel = styled.span<{
  $status: "ativo" | "concluido" | "aguardando";
}>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => {
    switch (props.$status) {
      case "ativo":
        return "var(--color-primary)";
      case "concluido":
        return "var(--color-text-tertiary)";
      case "aguardando":
        return "var(--color-text-secondary)";
      default:
        return "var(--color-text-secondary)";
    }
  }};
`;

export const Circle = styled.div<{
  $filled: boolean;
  $size: "small" | "medium";
  $status: "ativo" | "concluido" | "aguardando";
}>`
  position: relative;
  z-index: 1;
  width: ${(props) => (props.$size === "small" ? "24px" : "32px")};
  height: ${(props) => (props.$size === "small" ? "24px" : "32px")};
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;

  background: ${(props) => {
    if (!props.$filled) return "var(--color-border-medium)";

    switch (props.$status) {
      case "ativo":
        return "var(--color-btn-success)";
      case "concluido":
        return "var(--color-text-tertiary)";
      case "aguardando":
        return "var(--color-border-medium)";
      default:
        return "var(--color-btn-success)";
    }
  }};

  border: 3px solid
    ${(props) => {
      if (!props.$filled) {
        return props.$status === "aguardando"
          ? "var(--color-border-light)"
          : "var(--color-border-medium)";
      }

      switch (props.$status) {
        case "ativo":
          return "var(--color-btn-success)";
        case "concluido":
          return "var(--color-text-tertiary)";
        case "aguardando":
          return "var(--color-border-medium)";
        default:
          return "var(--color-btn-success)";
      }
    }};

  color: ${(props) => (props.$filled ? "white" : "var(--color-text-tertiary)")};
  cursor: help;
  transition: all 0.2s ease;

  /* Check visual nas etapas concluídas (estilo delivery) */
  &::after {
    content: ${(props) => (props.$filled ? '"✓"' : '""')};
  }

  &:hover {
    transform: scale(1.06);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
  }
`;

// Timeline vertical para modo "details"
export const AttemptsTimeline = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--color-border-light);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: flex-start;
`;

export const TimelineBulletColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const TimelineCircle = styled.div<{ $completed: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid
    ${(props) =>
      props.$completed
        ? "var(--color-btn-success)"
        : "var(--color-border-medium)"};
  background: ${(props) =>
    props.$completed ? "var(--color-btn-success)" : "var(--color-bg-primary)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  color: white;
`;

export const TimelineConnector = styled.div<{ $isLast: boolean }>`
  flex: 1;
  width: 2px;
  background: ${(props) =>
    props.$isLast ? "transparent" : "var(--color-border-light)"};
  margin-top: 2px;
`;

export const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const TimelineTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

export const TimelineMeta = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
`;

export const TimelineDescription = styled.div`
  font-size: 0.8rem;
  color: var(--color-text-secondary);
`;
