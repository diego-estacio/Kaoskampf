import styled from "styled-components";

/**
 * Estilos globais reutilizáveis para componentes de filtro
 * Usado por ContactFilters, ClientFilters, etc.
 */

export const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

export const FilterGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const FilterButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 44px;
  padding: 0 1rem;
  border: 2px solid
    ${(props) =>
      props.$isActive ? "var(--color-primary)" : "var(--color-border-light)"};
  background: ${(props) =>
    props.$isActive ? "var(--color-primary-light)" : "white"};
  color: ${(props) =>
    props.$isActive ? "var(--color-primary)" : "var(--color-text-secondary)"};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;

  svg {
    font-size: 1rem;
  }

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
    color: var(--color-primary);
  }
`;

export const DropdownOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

export const DropdownContent = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: #1a1a2e;
  border: 2px solid var(--color-border-light);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 1rem;
  min-width: 280px;
  z-index: 1000;
`;

export const DropdownSection = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary);
  margin: 0 0 0.75rem 0;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: var(--color-bg-tertiary);
  }
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-primary);
`;

export const CheckboxText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-primary);
  font-weight: 500;
`;

export const FilterBadge = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 0.375rem;
  background: ${(props) => props.$color || "var(--color-primary)"};
  color: white;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: auto;
`;

export const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  background: var(--color-bg-tertiary);
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 0.75rem;

  &:hover {
    background: var(--color-border-light);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
