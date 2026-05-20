import React, { useState, useRef, useEffect } from "react";
import { MdFilterList } from "react-icons/md";
import * as S from "../FilterStyles";

interface EmpresaFiltersProps {
  onFilterChange: (filters: EmpresaFilterState) => void;
}

export interface EmpresaFilterState {
  status: number[];
  porte: string[];
}

const statusOptions = [
  { value: 0, label: "Cadastrado" },
  { value: 2, label: "Reunião" },
  { value: 3, label: "Proposta" },
  { value: 4, label: "Atendimento" },
];

const porteOptions = [
  { value: "pequeno", label: "Pequeno" },
  { value: "medio", label: "Médio" },
  { value: "grande", label: "Grande" },
];

export const EmpresaFilters: React.FC<EmpresaFiltersProps> = ({
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<EmpresaFilterState>({
    status: [],
    porte: [],
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleStatusToggle = (statusValue: number) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(statusValue)
        ? prev.status.filter((s) => s !== statusValue)
        : [...prev.status, statusValue],
    }));
  };

  const handlePorteToggle = (porteValue: string) => {
    setFilters((prev) => ({
      ...prev,
      porte: prev.porte.includes(porteValue)
        ? prev.porte.filter((p) => p !== porteValue)
        : [...prev.porte, porteValue],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: [],
      porte: [],
    });
  };

  const activeFiltersCount = filters.status.length + filters.porte.length;
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <S.FilterContainer>
      <S.FilterGroup ref={dropdownRef}>
        <S.FilterButton
          $isActive={hasActiveFilters}
          onClick={() => setIsOpen(!isOpen)}
        >
          <MdFilterList />
          Filtros
          {hasActiveFilters && (
            <S.FilterBadge>{activeFiltersCount}</S.FilterBadge>
          )}
        </S.FilterButton>

        {isOpen && (
          <>
            <S.DropdownOverlay onClick={() => setIsOpen(false)} />
            <S.DropdownContent>
              {/* Status */}
              <S.DropdownSection>
                <S.SectionTitle>Status</S.SectionTitle>
                <S.CheckboxGroup>
                  {statusOptions.map((option) => (
                    <S.CheckboxLabel key={option.value}>
                      <S.Checkbox
                        checked={filters.status.includes(option.value)}
                        onChange={() => handleStatusToggle(option.value)}
                      />
                      <S.CheckboxText>{option.label}</S.CheckboxText>
                    </S.CheckboxLabel>
                  ))}
                </S.CheckboxGroup>
              </S.DropdownSection>

              {/* Porte */}
              <S.DropdownSection>
                <S.SectionTitle>Porte da Empresa</S.SectionTitle>
                <S.CheckboxGroup>
                  {porteOptions.map((option) => (
                    <S.CheckboxLabel key={option.value}>
                      <S.Checkbox
                        checked={filters.porte.includes(option.value)}
                        onChange={() => handlePorteToggle(option.value)}
                      />
                      <S.CheckboxText>{option.label}</S.CheckboxText>
                    </S.CheckboxLabel>
                  ))}
                </S.CheckboxGroup>
              </S.DropdownSection>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <S.ClearButton onClick={handleClearFilters}>
                  Limpar Filtros
                </S.ClearButton>
              )}
            </S.DropdownContent>
          </>
        )}
      </S.FilterGroup>
    </S.FilterContainer>
  );
};

export default EmpresaFilters;
