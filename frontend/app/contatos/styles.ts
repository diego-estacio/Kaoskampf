import styled from "styled-components";

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

export const PageActions = styled.div`
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
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  min-width: 220px;

  svg {
    width: 16px;
    height: 16px;
    color: var(--color-text-tertiary);
  }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: var(--color-text-primary);

  &::placeholder {
    color: var(--color-text-tertiary);
  }
`;

export const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid var(--color-border-light);
  border-radius: 8px;
  font-size: 0.875rem;
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);

  &:focus {
    outline: none;
    border-color: var(--color-gradient-start);
  }
`;

export const AddButton = styled.button`
  background: linear-gradient(
    135deg,
    var(--color-gradient-start),
    var(--color-gradient-end)
  );
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

export const ContactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

interface ContactCardProps {
  $leadTemperature?: string;
}

export const ContactCard = styled.div<ContactCardProps>`
  position: relative;
  background: ${(props) => {
    switch (props.$leadTemperature) {
      case "quente":
        return "linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0.13) 100%)";
      case "morno":
        return "linear-gradient(135deg, rgba(249, 161, 30, 0.06) 0%, rgba(249, 161, 30, 0.13) 100%)";
      case "frio":
        return "linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(139, 92, 246, 0.13) 100%)";
      case "inativo":
        return "linear-gradient(135deg, rgba(248, 113, 113, 0.06) 0%, rgba(248, 113, 113, 0.13) 100%)";
      default:
        return "var(--color-bg-primary)";
    }
  }};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid
    ${(props) => {
      switch (props.$leadTemperature) {
        case "quente":
          return "var(--color-lead-hot)";
        case "morno":
          return "var(--color-lead-warm)";
        case "frio":
          return "var(--color-lead-cold)";
        case "inativo":
          return "var(--color-lead-inactive)";
        default:
          return "var(--color-slate-100)";
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

export const ContactHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const ContactInfo = styled.div`
  flex: 1;
`;

export const ContactName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem 0;
`;

export const ContactCompany = styled.p`
  color: var(--color-primary);
  font-weight: 500;
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
`;

export const ContactRole = styled.p`
  color: var(--color-text-tertiary);
  margin: 0;
  font-size: 0.875rem;
`;

export const ContactStatus = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: ${(props) => {
    switch (props.$status) {
      // temperatura (leads)
      case "quente":
        return "var(--color-lead-hot)";
      case "morno":
        return "var(--color-lead-warm)";
      case "frio":
        return "var(--color-lead-cold)";
      case "inativo":
        return "var(--color-lead-inactive)";
      // pipeline stage (clientes / numérico)
      case "0":
      case "cadastrado":
        return "rgba(139, 92, 246, 0.55)";
      case "2":
      case "reuniao":
        return "rgba(234, 179, 8, 0.7)";
      case "3":
      case "proposta":
        return "rgba(255, 128, 0, 0.7)";
      case "4":
      case "atendimento":
        return "rgba(16, 185, 129, 0.7)";
      default:
        return "rgba(139, 92, 246, 0.55)";
    }
  }};
`;

export const ContactDetails = styled.div`
  margin-bottom: 1rem;
`;

export const ContactField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-tertiary);

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FieldIcon = styled.span`
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ContactActions = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  flex: 1;
  min-width: calc(33.33% - 0.27rem);
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  color: var(--color-text-tertiary);
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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

export const LastContact = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  text-align: center;
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--color-text-tertiary);
    margin-bottom: 1.5rem;
  }
`;

export const LoadingCard = styled(ContactCard)`
  pointer-events: none;
`;

export const LoadingBar = styled.div<{ width?: string; height?: string }>`
  background: var(--color-slate-100);
  height: ${(props) => props.height || "20px"};
  width: ${(props) => props.width || "100%"};
  border-radius: 4px;
  margin-bottom: 10px;
`;

// Estilos específicos para o componente ContactAttempts dentro do ContactCard
export const ContactAttemptsWrapper = styled.div`
  padding: 0.75rem 0;
  border-top: 1px solid var(--color-slate-100);
  margin-top: 0.75rem;
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

// List View Styles
export const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ContactListItem = styled.div<ContactCardProps>`
  position: relative;
  background: var(--color-bg-primary);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  border-left: 4px solid
    ${(props) => {
      switch (props.$leadTemperature) {
        case "quente":
          return "var(--color-lead-hot)";
        case "morno":
          return "var(--color-lead-warm)";
        case "frio":
          return "var(--color-lead-cold)";
        case "inativo":
          return "var(--color-lead-inactive)";
        default:
          return "var(--color-slate-200)";
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
  grid-template-columns: 2fr 1.5fr 1.5fr 120px 150px 120px;
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
  color: var(--color-text-primary);
  margin: 0;
`;

export const ListItemCompany = styled.p`
  color: var(--color-primary);
  font-weight: 500;
  margin: 0;
  font-size: 0.8rem;
`;

export const ListItemDetail = styled.div`
  font-size: 0.85rem;
  color: var(--color-text-tertiary);

  ${ContactField} {
    margin-bottom: 0;
    gap: 0.5rem;
  }
`;

export const ListItemStatus = styled.span<{ $status: string }>`
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: white;
  background: ${(props) => {
    switch (props.$status) {
      // temperatura (leads)
      case "quente":
        return "var(--color-lead-hot)";
      case "morno":
        return "var(--color-lead-warm)";
      case "frio":
        return "var(--color-lead-cold)";
      case "inativo":
        return "var(--color-lead-inactive)";
      // pipeline stage (clientes / numérico)
      case "0":
      case "cadastrado":
        return "rgba(139, 92, 246, 0.55)";
      case "2":
      case "reuniao":
        return "rgba(234, 179, 8, 0.7)";
      case "3":
      case "proposta":
        return "rgba(255, 128, 0, 0.7)";
      case "4":
      case "atendimento":
        return "rgba(16, 185, 129, 0.7)";
      default:
        return "rgba(139, 92, 246, 0.55)";
    }
  }};
`;

export const ListItemDate = styled.div`
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  text-align: center;
`;

export const ListItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;

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

export const LoadingText = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-text-tertiary);
  font-size: 0.9rem;
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
