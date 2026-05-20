import styled from "styled-components";

// Dropdown Container
export const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

// Botão principal do dropdown
export const DropdownButton = styled.button<{ $hasFilters?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${(props) =>
    props.$hasFilters ? "var(--color-primary)" : "white"};
  color: ${(props) =>
    props.$hasFilters ? "white" : "var(--color-text-secondary)"};
  border: 2px solid
    ${(props) =>
      props.$hasFilters ? "var(--color-primary)" : "var(--color-border-light)"};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    background: ${(props) =>
      props.$hasFilters
        ? "var(--color-primary-hover)"
        : "rgba(102, 126, 234, 0.05)"};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
`;

// Badge de contador
export const FilterBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-primary);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
`;

// Seta do dropdown
export const DropdownArrow = styled.span<{ $isOpen?: boolean }>`
  font-size: 0.7rem;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

// Painel do dropdown
export const DropdownPanel = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 420px;
  background: #1a1a2e;
  border: 2px solid var(--color-border-light);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const FilterContainer = styled.div`
  background: #1a1a2e;
  border: 2px solid var(--color-border-light);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const FilterTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ClearButton = styled.button`
  background: transparent;
  border: 1px solid var(--color-border-light);
  color: var(--color-text-tertiary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: rgba(102, 126, 234, 0.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FilterSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FilterLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const CheckboxLabel = styled.label<{
  $isChecked?: boolean;
  $cor?: string;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid
    ${(props) =>
      props.$isChecked
        ? props.$cor || "var(--color-primary)"
        : "var(--color-border-light)"};
  background: ${(props) =>
    props.$isChecked
      ? props.$cor
        ? `${props.$cor}15`
        : "rgba(102, 126, 234, 0.1)"
      : "white"};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) =>
    props.$isChecked
      ? props.$cor || "var(--color-primary)"
      : "var(--color-text-tertiary)"};

  &:hover {
    border-color: ${(props) => props.$cor || "var(--color-primary)"};
    background: ${(props) =>
      props.$cor ? `${props.$cor}10` : "rgba(102, 126, 234, 0.05)"};
    transform: translateY(-1px);
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${(props) => props.$cor || "var(--color-primary)"};
  }
`;

export const ResultCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: var(--color-slate-50);
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);

  strong {
    color: var(--color-primary);
    margin: 0 0.25rem;
  }
`;

// Footer do dropdown
export const DropdownFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border-light);
`;

// Botão Aplicar
export const ApplyButton = styled.button`
  flex: 1;
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
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;
