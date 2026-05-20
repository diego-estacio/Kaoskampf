import styled from "styled-components";

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  margin-bottom: 0.75rem;
`;

export const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.8rem;
  color: var(--color-btn-primary);
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: var(--color-text-tertiary);
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

export const PageSubtitle = styled.p`
  margin: 0.25rem 0 0;
  color: var(--color-text-tertiary);
  font-size: 0.95rem;
`;

export const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

export const TableWrapper = styled.div`
  background: var(--color-bg-primary);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

export const Thead = styled.thead`
  background: var(--color-bg-elevated);
`;

export const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--color-text-tertiary);
  border-bottom: 1px solid var(--color-border-light);
`;

export const Td = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border-light);
  color: var(--color-text-secondary);
`;

export const Tr = styled.tr`
  &:hover {
    background: var(--color-bg-elevated);
  }
`;

export const EmptyState = styled.div`
  padding: 2.5rem 1rem;
  text-align: center;
  color: var(--color-text-tertiary);
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #fff;
  background: ${({ $status }) => {
    switch ($status) {
      case "aprovada":
        return "var(--color-lead-hot)";
      case "enviada":
      case "visualizada":
        return "var(--color-btn-primary)";
      case "recusada":
        return "#ef4444";
      case "expirada":
        return "#6b7280";
      default:
        return "#a0aec0";
    }
  }};
`;

export const PrimaryButton = styled.button`
  background: linear-gradient(
    135deg,
    var(--color-gradient-start),
    var(--color-gradient-end)
  );
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.875rem;
`;

export const SecondaryButton = styled.button`
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  border-radius: 16px;
  border: 1px solid var(--color-border-light);
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
`;

export const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  min-width: 180px;
`;

export const NewProposalCard = styled.div`
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-bg-primary);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
`;

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--color-text-primary);
`;

export const SectionSubtitle = styled.p`
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: var(--color-text-tertiary);
`;

export const FieldRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const Field = styled.div`
  flex: 1 1 180px;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  margin-bottom: 0.25rem;
`;

export const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.45rem 0.7rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 70px;
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  resize: none;
`;

export const SmallSelect = styled.select`
  width: 100%;
  padding: 0.45rem 0.7rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
`;

export const ComboBoxContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const ComboBoxInput = styled.input`
  width: 100%;
  padding: 0.45rem 0.7rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
`;

export const ComboBoxArrow = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: var(--color-text-tertiary);
`;

export const ComboBoxList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  z-index: 20;
`;

export const ComboBoxOption = styled.li<{ $isSelected: boolean }>`
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  cursor: pointer;

  background: ${({ $isSelected }) =>
    $isSelected ? "var(--color-bg-primary)" : "transparent"};

  &:hover {
    background: var(--color-bg-primary);
  }
`;

export const ItemsTable = styled.table`
  width: 100%;

  margin-top: 0.75rem;
  font-size: 0.8rem;
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  background-color: var(--color-bg-primary);
`;

export const ItemsTh = styled.th`
  text-align: left;
  padding: 0.4rem 0.5rem;
  font-weight: 500;
  color: var(--color-text-tertiary);
  border-bottom: 1px solid var(--color-border-light);
`;

export const ItemsTd = styled.td`
  padding: 0.4rem 0.5rem;
  border-bottom: 1px solid var(--color-border-light);
`;

export const SmallInput = styled.input`
  width: 100%;
  padding: 0.3rem 0.45rem;
  border-radius: 6px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
`;

export const InlineActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

// Aliases e elementos adicionais usados na página de propostas

export const ItemsTableWrapper = styled.div`
  margin-top: 0.75rem;
  overflow-x: auto;
`;

export const SectionDivider = styled.hr`
  border: 0;
  border-top: 1px solid var(--color-border-light);
  margin: 1.25rem 0;
`;

export const CatalogRow = styled.div`
  display: flex;
  justify-content: space-between;

  gap: 0.5rem;
  align-items: center;
  width: 100%;

  .combo-box-container {
    width: 65%;
  }

  .buttons-container {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .catalog-button {
    background-color: var(--color-primary-dark);
    color: #fff;
  }
`;

export const ItemCard = styled.div`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  border-left: 4px solid var(--color-btn-primary);
  background: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const DangerButton = styled.button`
  background: #dc2626;
  color: #1a1a2e;
  border-radius: 8px;
  border: none;
  padding: 0.35rem 0.8rem;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #b91c1c;
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
`;

// Alias em estilo para manter compatibilidade com TextArea usado na página
export const TextArea = Textarea;

export const ProposalHero = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 12px;
  margin: 1rem 0 1.5rem;
  background: radial-gradient(circle at top left, #0f172a, #020617);
  color: #2d2d4e;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
`;

export const ProposalHeroContent = styled.div`
  max-width: 640px;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`;

export const ProposalHeroTitle = styled.h1`
  margin: 0 0 0.4rem;
  font-size: 1.25rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const ProposalHeroSubtitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #9ca3af;
`;

export const TotalCard = styled.div`
  width: 100%;
  padding: 1.25rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #12121f 0%, #1e1e3a 100%);
  border: 2px solid var(--color-border-light);
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
`;

export const TotalLabel = styled.span`
  font-weight: 500;
  color: var(--color-text-tertiary);
`;

export const TotalValue = styled.span`
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 1.1rem;
`;

export const TotalFinalRow = styled(TotalRow)`
  padding-top: 0.75rem;
  border-top: 2px solid var(--color-border-light);
  font-size: 1.15rem;
`;

export const TotalFinalValue = styled(TotalValue)`
  font-size: 1.5rem;
  color: var(--color-btn-primary);
  font-weight: 700;
`;

export const DiscountRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

export const DiscountTypeSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  max-width: 120px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-btn-primary);
  }
`;

export const DiscountInput = styled(Input)`
  max-width: 150px;
`;
