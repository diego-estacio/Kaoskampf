import React, { useState, useRef, useEffect } from "react";
import * as S from "./ContactFilters.styles";
import { FiltrosContato, OPCOES_STATUS, OPCOES_TEMPERATURA } from "./types";
import { MdFilterList } from "react-icons/md";

interface ContactFiltersProps {
  filtros: FiltrosContato;
  onFiltrosChange: (filtros: FiltrosContato) => void;
  totalResultados: number;
  mostrarTemperatura?: boolean;
  mostrarToggleTodos?: boolean;
  mostrarTodos?: boolean;
  onMostrarTodosChange?: (show: boolean) => void;
}

export default function ContactFilters({
  filtros,
  onFiltrosChange,
  totalResultados,
  mostrarTemperatura = true,
  mostrarToggleTodos = false,
  mostrarTodos = false,
  onMostrarTodosChange,
}: ContactFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusChange = (value: string) => {
    const novosStatus = filtros.status.includes(value)
      ? filtros.status.filter((s) => s !== value)
      : [...filtros.status, value];

    onFiltrosChange({
      ...filtros,
      status: novosStatus,
    });
  };

  const handleTemperaturaChange = (value: string) => {
    const novasTemperaturas = filtros.temperaturas.includes(value)
      ? filtros.temperaturas.filter((t) => t !== value)
      : [...filtros.temperaturas, value];

    onFiltrosChange({
      ...filtros,
      temperaturas: novasTemperaturas,
    });
  };

  const handleLimparFiltros = () => {
    onFiltrosChange({
      status: [],
      temperaturas: [],
    });
  };

  const totalFiltrosAtivos =
    filtros.status.length + filtros.temperaturas.length;

  return (
    <S.DropdownWrapper ref={dropdownRef}>
      <S.DropdownButton
        onClick={() => setIsOpen(!isOpen)}
        $hasFilters={totalFiltrosAtivos > 0}
      >
        <MdFilterList />
        Filtros
        {totalFiltrosAtivos > 0 && (
          <S.FilterBadge>{totalFiltrosAtivos}</S.FilterBadge>
        )}
        <S.DropdownArrow $isOpen={isOpen}>▼</S.DropdownArrow>
      </S.DropdownButton>

      {isOpen && (
        <S.DropdownPanel>
          <S.FilterSection>
            <S.FilterLabel>Status do Contato:</S.FilterLabel>
            <S.CheckboxGroup>
              {OPCOES_STATUS.map((opcao) => (
                <S.CheckboxLabel
                  key={opcao.value}
                  $isChecked={filtros.status.includes(opcao.value)}
                >
                  <input
                    type="checkbox"
                    checked={filtros.status.includes(opcao.value)}
                    onChange={() => handleStatusChange(opcao.value)}
                  />
                  {opcao.label}
                </S.CheckboxLabel>
              ))}
            </S.CheckboxGroup>
          </S.FilterSection>

          {mostrarTemperatura && (
            <S.FilterSection>
              <S.FilterLabel>Temperatura do Lead:</S.FilterLabel>
              <S.CheckboxGroup>
                {OPCOES_TEMPERATURA.map((opcao) => (
                  <S.CheckboxLabel
                    key={opcao.value}
                    $isChecked={filtros.temperaturas.includes(opcao.value)}
                    $cor={opcao.cor}
                  >
                    <input
                      type="checkbox"
                      checked={filtros.temperaturas.includes(opcao.value)}
                      onChange={() => handleTemperaturaChange(opcao.value)}
                    />
                    {opcao.label}
                  </S.CheckboxLabel>
                ))}
              </S.CheckboxGroup>
            </S.FilterSection>
          )}

          {mostrarToggleTodos && onMostrarTodosChange && (
            <S.FilterSection>
              <S.FilterLabel>Visualização:</S.FilterLabel>
              <S.ToggleRow>
                <span>Mostrar todos os contatos</span>
                <S.Switch>
                  <input
                    type="checkbox"
                    checked={mostrarTodos}
                    onChange={(e) => onMostrarTodosChange(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </S.Switch>
              </S.ToggleRow>
            </S.FilterSection>
          )}

          <S.DropdownFooter>
            <S.ClearButton
              onClick={handleLimparFiltros}
              disabled={totalFiltrosAtivos === 0}
            >
              Limpar
            </S.ClearButton>
            <S.ApplyButton onClick={() => setIsOpen(false)}>
              Aplicar ({totalResultados})
            </S.ApplyButton>
          </S.DropdownFooter>
        </S.DropdownPanel>
      )}
    </S.DropdownWrapper>
  );
}
