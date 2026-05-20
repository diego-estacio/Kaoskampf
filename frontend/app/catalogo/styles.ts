import styled from "styled-components";

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

export const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const SelectedBrandLabel = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-light);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  min-width: 220px;
`;

export const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

export const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  width: 100%;
  max-width: 260px;

  &::placeholder {
    color: var(--color-text-tertiary);
  }
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
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
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

  &.details-column {
    display: flex;
  }
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

export const InlineForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px dashed var(--color-border-light);
`;

export const SmallInput = styled.input`
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  min-width: 150px;

  &::placeholder {
    color: var(--color-text-tertiary);
  }
`;

export const SmallTextarea = styled.textarea`
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  min-width: 220px;
  width: 100%;
  min-height: 100px;
  resize: none;

  &::placeholder {
    color: var(--color-text-tertiary);
  }
`;

export const SmallButton = styled.button`
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  border: none;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
`;

export const SaveButton = styled(SmallButton)`
  background: var(--color-btn-primary);
  color: #fff;
`;

export const CancelButton = styled(SmallButton)`
  background: var(--color-bg-primary);
  color: var(--color-text-tertiary);
`;

export const MarcasContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 40px;
  padding: 0.5rem;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  background: var(--color-bg-sidebar);
`;

export const MarcaChip = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;

  ${(props) =>
    props.$selected
      ? `
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    color: white;
    border-color: var(--color-primary);
    
    &:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);
    }
  `
      : `
    background: var(--color-bg-primary);
    color: var(--color-text-tertiary);
    border-color: var(--color-border-light);
    
    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

export const EmptyMarcas = styled.div`
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
  font-style: italic;
  padding: 0.5rem;
`;

export const DetailsContainer = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 0.8rem;
`;

export const DetailsColumn = styled.div`
  flex: 1 1 0;
  padding: 0.5rem 0.75rem;
  background: rgba(34, 197, 94, 0.04);
  border: 1px dashed var(--color-border-light);
`;

export const DetailsTitle = styled.div`
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.35rem;
  color: var(--color-text-tertiary);

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--color-emerald-500);
  }
`;

export const DetailsText = styled.div`
  white-space: pre-line;
`;

export const IconButton = styled.button`
  border: none;
  background: transparent;
  padding: 0.25rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  cursor: pointer;

  &:hover {
    background: var(--color-slate-100);
    color: var(--color-text-primary);
  }
`;

export const DetailsToggleButton = styled.button`
  border: none;
  background: transparent;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  cursor: pointer;

  &:hover {
    color: var(--color-text-primary);
    text-decoration: underline;
  }
`;
