import styled from "styled-components";

export const DashboardContainer = styled.div`
  min-height: 100vh;
  background: var(--color-bg-secondary);
`;

export const MainContent = styled.main`
  padding: 2rem;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2rem;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex: 0 0 420px;

  @media (max-width: 1280px) {
    flex: 0 0 360px;
  }

  @media (max-width: 1024px) {
    width: 100%;
    flex: 1 1 auto;
    grid-template-columns: 1fr;
  }
`;

export const StatsHeader = styled.div`
  grid-column: 1 / -1;
`;

export const StatsHeaderTitle = styled.h2`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`;

export const StatsHeaderSubtitle = styled.p`
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0.1rem 0 0;
`;

export const StatCard = styled.div`
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 1.25rem 1.25rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border-light);
  border-left: 4px solid var(--color-primary);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  min-height: 130px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  }
`;

export const StatsMainCard = styled(StatCard)`
  grid-column: 1 / -1;
  min-height: 150px;
`;

export const ViewToggle = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: var(--color-bg-elevated);
  padding: 0.15rem;
  font-size: 0.75rem;
`;

export const ViewToggleButton = styled.button<{ $active?: boolean }>`
  border: none;
  background: ${(props) =>
    props.$active ? "var(--color-primary)" : "transparent"};
  color: ${(props) => (props.$active ? "#fff" : "var(--color-text-secondary)")};
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    background: var(--color-primary-hover);
    color: #fff;
  }
`;

export const ChartContainer = styled.div`
  margin-top: 0.75rem;
`;

export const ChartTabs = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

export const ChartTabButton = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${(props) =>
      props.$active ? "var(--color-primary)" : "var(--color-border-light)"};
  background: ${(props) =>
    props.$active ? "var(--color-primary-light)" : "var(--color-bg-elevated)"};
  color: ${(props) =>
    props.$active
      ? "var(--color-text-primary)"
      : "var(--color-text-secondary)"};
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-text-primary);
  }
`;

export const ChartBars = styled.div`
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  display: flex;
  align-items: flex-end;
  gap: 0.25rem;
  height: 120px;
  padding: 0.5rem;
`;

export const ChartBar = styled.div<{ $height: number }>`
  flex: 1;
  min-width: 6px;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(
    180deg,
    var(--color-primary),
    var(--color-primary-dark)
  );
  height: calc(${(props) => props.$height}% + 2px);
  transition: height 0.2s ease;
`;

export const ChartAxisLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.35rem;
  font-size: 0.65rem;
  color: var(--color-text-tertiary);
`;

export const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
  line-height: 1;
`;

export const StatChange = styled.div<{ $color?: string }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.$color || "var(--color-btn-success)"};
  margin-bottom: auto;
  line-height: 1.4;
`;

export const StatSecondary = styled.div`
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-bg-elevated);
  line-height: 1.5;

  strong {
    color: var(--color-text-primary);
    font-weight: 600;
  }
`;

export const TimelineContainer = styled.div`
  border-radius: 12px;
  padding: 2rem;

  flex: 1;
`;

export const TimelineItem = styled.div`
  background: var(--color-bg-primary);
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border: 2px solid var(--color-bg-elevated);
  border-left: 4px solid var(--color-primary);
  transition: background 0.15s ease;

  &:hover {
    background: var(--color-bg-elevated);
  }

  &:first-child {
    padding-top: 0.5rem;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const TimelineIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.25rem;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const TimelineContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

export const TimelineTitle = styled.h3`
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
`;

export const TimelineUser = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

export const TimelineDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  margin: 0;
  line-height: 1.5;
`;

export const TimelineMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

export const TimelineContact = styled.span`
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 0.875rem;
`;

export const TimelineSeparator = styled.span`
  color: var(--color-border-medium);
  font-size: 0.875rem;
`;

export const TimelineEmpresa = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

export const TimelineTime = styled.span`
  font-size: 0.8125rem;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  font-weight: 500;
`;

export const TimelineLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: var(--color-primary);
  color: #fff;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-left: auto;
  border: none;

  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(139, 92, 246, 0.35);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
`;

export const EmptyMessage = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: 1rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
`;

export const PageSubtitle = styled.p`
  color: var(--color-text-secondary);
  margin: 0;
`;
