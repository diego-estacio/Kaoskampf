import styled from "styled-components";

// Reutilizar styles da página principal
export * from "../styles";

// Perfil do usuário na página de detalhes
export const UserProfile = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  flex: 1;
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;

  gap: 0.5rem;
`;

export const InfoLabel = styled.span`
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const InfoValue = styled.span`
  color: #e2e8f0;
  font-weight: 500;
`;

export const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => (props.$active ? "#dcfce7" : "#3d1515")};
  color: ${(props) => (props.$active ? "#166534" : "#991b1b")};
`;

// Timeline de atividades
export const TimelineSection = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex: 3;
`;

export const TimelineTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 1.5rem 0;
`;

export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TimelineItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #1e1e3a;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  border-left: 4px solid #8b5cf6;

  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border: 1px solid #2d2d4e;
    background: #12121f;
  }
  &:first-child {
    padding-top: 0.5rem;
  }
`;

export const TimelineIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
`;

export const TimelineContent = styled.div`
  flex: 1;
`;

export const TimelineActivity = styled.h4`
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.25rem 0;
`;

export const TimelineDetails = styled.p`
  color: #718096;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
`;

export const TimelineTime = styled.span`
  font-size: 0.75rem;
  color: #718096;
`;

export const TimelineLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: #8b5cf6;
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  border: none;
  width: fit-content;

  &:hover {
    background: #5a6fd6;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const EmptyMessage = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: #718096;
  font-size: 0.875rem;
`;

export const UserContent = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
`;

// ── Timeline section header with view toggle ──────────────────────────────────

export const TimelineSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const ViewToggleBar = styled.div`
  display: inline-flex;
  background: #1a1a2e;
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
`;

export const ToggleBtn = styled.button<{ $active: boolean }>`
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${(p) => (p.$active ? "#1a1a2e" : "transparent")};
  color: ${(p) => (p.$active ? "#e2e8f0" : "#a0aec0")};
  box-shadow: ${(p) => (p.$active ? "0 1px 3px rgba(0,0,0,0.12)" : "none")};

  &:hover {
    color: #e2e8f0;
  }
`;

// ── User Stats Panel ──────────────────────────────────────────────────────────

export const StatsPanelWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StatsPanelTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
`;

export const StatsPanelSub = styled.p`
  font-size: 0.8125rem;
  color: #718096;
  margin: 0;
`;

export const StatsMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div<{ $accent: string }>`
  background: #1a1a2e;
  border-radius: 14px;
  padding: 1.25rem 1.25rem 1.1rem;
  border-left: 4px solid ${(p) => p.$accent};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  }
`;

export const MetricLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  min-width: 0;
`;

export const MetricIconWrap = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${(p) => p.$color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.$color};
  font-size: 1.1rem;
  margin-bottom: 0.35rem;
`;

export const MetricLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #718096;
  line-height: 1.2;
`;

export const MetricNumber = styled.div`
  font-size: 2.25rem;
  font-weight: 800;
  color: #e2e8f0;
  line-height: 1;
  margin: 0.2rem 0;
  font-variant-numeric: tabular-nums;
`;

export const MetricSub = styled.div`
  font-size: 0.75rem;
  color: #718096;
  line-height: 1.4;
`;

export const MetricTrend = styled.div<{ $up: boolean }>`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${(p) => (p.$up ? "#10b981" : "#f43f5e")};
  margin-top: 0.4rem;
`;

export const MetricRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
`;

export const SparkLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 600;
  color: #718096;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const SparklineWrap = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 52px;
`;

export const SparkBar = styled.div<{ $height: number; $color: string }>`
  width: 7px;
  border-radius: 3px 3px 0 0;
  background: ${(p) => p.$color};
  height: ${(p) => p.$height}%;
  opacity: 0.85;
  transition: height 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

export const SparkDayLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 0.6rem;
  color: #2d2d4e;
  margin-top: 2px;
`;
