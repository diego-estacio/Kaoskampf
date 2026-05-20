import styled from "styled-components";
import { statusUtils } from "../../src/utils";
export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
`;

export const PageHeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: 1px solid #2d2d4e;
  background: #1a1a2e;
  min-width: 220px;

  svg {
    width: 16px;
    height: 16px;
    color: #718096;
  }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: #e2e8f0;

  &::placeholder {
    color: #718096;
  }
`;

export const AddButton = styled.button`
  height: 44px;
  padding: 0 1.5rem;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  line-height: 1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const EmpresasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const EmpresasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SecondaryButton = styled.button`
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
`;

export const PaginationBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  font-size: 0.85rem;
`;

interface EmpresaCardProps {
  $status?: number;
}

export const EmpresaCard = styled.div<EmpresaCardProps>`
  background: ${(props) => {
    switch (props.$status) {
      case 4: // Atendimento - verde
        return "linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0.12) 100%)";
      case 3: // Proposta - laranja
        return "linear-gradient(135deg, rgba(249, 161, 30, 0.06) 0%, rgba(249, 161, 30, 0.12) 100%)";
      case 2: // Reunião - amarelo
        return "linear-gradient(135deg, rgba(251, 191, 36, 0.06) 0%, rgba(251, 191, 36, 0.12) 100%)";
      case 0: // Cadastrado
      default:
        return "linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(139, 92, 246, 0.12) 100%)";
    }
  }};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid
    ${(props) => {
      switch (props.$status) {
        case 4: // Atendimento
          return "var(--color-lead-hot)"; // Verde
        case 3: // Proposta
          return "var(--color-lead-warm)"; // Laranja
        case 2: // Reunião
          return "#eab308"; // Amarelo
        case 0: // Cadastrado
        default:
          return "var(--color-lead-cold)"; // Azul/Roxo
      }
    }};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    filter: brightness(1.08);
  }
`;

export const EmpresaHeader = styled.div`
  margin-bottom: 1rem;
`;

export const EmpresaName = styled.h3`
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
  font-size: 1.125rem;
`;

export const EmpresaPorte = styled.span<{ $porte: string }>`
  margin: 1rem 0;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  ${(props) => {
    const colors = statusUtils.getPorteColor(props.$porte);
    return `
      background: ${colors.bg};
      color: ${colors.text};
    `;
  }}
`;

export const EmpresaInfo = styled.div`
  margin-bottom: 1rem;
`;

export const EmpresaSite = styled.p`
  color: var(--color-primary);
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
`;

export const EmpresaObservacoes = styled.p`
  color: #718096;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
`;

export const EmpresaStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #1e1e3a;
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatNumber = styled.div`
  font-weight: 600;
  color: #e2e8f0;
  font-size: 1.125rem;
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #718096;
`;

export const ContactsList = styled.div`
  margin-top: 1rem;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #1e1e3a;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #12121f;
    margin: 0 -0.5rem;
    padding: 0.5rem;
    border-radius: 6px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ContactName = styled.span`
  font-weight: 500;
  color: #cbd5e0;
  font-size: 0.875rem;
`;

export const ContactRole = styled.span`
  color: #718096;
  font-size: 0.75rem;
`;

export const EmpresaActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #1e1e3a;
`;

export const ActionButton = styled.button`
  flex: 1;
  min-width: calc(33.33% - 0.27rem);
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  color: var(--color-text-tertiary);
  border-radius: 6px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &.primary {
    background: var(--color-btn-primary);
    color: white;
    border-color: var(--color-btn-primary);
  }
  &.contato {
    background: var(--color-btn-contact);
    color: white;
    border-color: var(--color-btn-contact);
    width: 100%;
  }

  &:hover {
    border-color: var(--color-btn-primary);
    color: var(--color-btn-primary);
    transform: translateY(-1px);
  }

  &.primary:hover {
    background: var(--color-btn-primary-hover);
  }

  &.contato:hover {
    background: var(--color-btn-contact-hover);
  }
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.3;
  }

  h3 {
    font-size: 1.5rem;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--color-text-tertiary);
    margin-bottom: 2rem;
  }
`;

// View Toggle Styles
export const ViewToggle = styled.div`
  display: flex;
  gap: 0.25rem;
  background: var(--color-bg-elevated);
  padding: 0.25rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
`;

interface ViewButtonProps {
  $active: boolean;
}

export const ViewButton = styled.button<ViewButtonProps>`
  background: ${(props) =>
    props.$active ? "var(--color-primary)" : "transparent"};
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$active ? "#fff" : "var(--color-text-tertiary)")};
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.$active ? "0 1px 4px rgba(139,92,246,0.4)" : "none"};

  &:hover {
    background: ${(props) =>
      props.$active
        ? "var(--color-primary-hover)"
        : "var(--color-bg-elevated)"};
    color: ${(props) => (props.$active ? "#fff" : "var(--color-text-primary)")};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const EmpresaListItem = styled.div<EmpresaCardProps>`
  background: #1a1a2e;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid
    ${(props) => {
      switch (props.$status) {
        case 4: // Atendimento
          return "var(--color-lead-hot)"; // Verde
        case 3: // Proposta
          return "var(--color-lead-warm)"; // Laranja
        case 2: // Reunião
          return "#eab308"; // Amarelo
        case 0: // Cadastrado
        default:
          return "var(--color-lead-cold)"; // Azul/Roxo
      }
    }};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(4px);
  }
`;

export const ListItemContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
`;

export const ListItemMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ListItemName = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
`;

export const ListItemSite = styled.p`
  color: var(--color-primary);
  margin: 0;
  font-size: 0.8rem;
`;

export const ListItemDetail = styled.div`
  font-size: 0.85rem;
  color: #a0aec0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ListItemLabel = styled.span`
  color: #718096;
  font-size: 0.75rem;
`;

export const ListItemValue = styled.span`
  color: #e2e8f0;
  font-weight: 500;
`;

export const ListItemStatusBadge = styled.span`
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  justify-self: center;
`;

export const ListItemActions = styled.div`
  display: flex;
  gap: 0.5rem;

  ${ActionButton} {
    flex: none;
    min-width: auto;
    padding: 0.4rem 0.75rem;

    &.small {
      padding: 0.35rem 0.6rem;
      font-size: 0.75rem;
    }
  }
`;
