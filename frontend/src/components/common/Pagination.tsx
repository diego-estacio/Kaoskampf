import React from "react";
import styled from "styled-components";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number; // Máximo de números de página visíveis
}

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem;
`;

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid #2d2d4e")};
  background: ${(props) => (props.$active ? "#8b5cf6" : "white")};
  color: ${(props) => (props.$active ? "white" : "#a0aec0")};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  min-width: 2.5rem;
  opacity: ${(props) => (props.$disabled ? "0.5" : "1")};

  &:hover:not(:disabled) {
    background: ${(props) => (props.$active ? "#8b5cf6" : "#1e1e3a")};
    border-color: ${(props) => (props.$active ? "#8b5cf6" : "#2d2d4e")};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const Ellipsis = styled.span`
  padding: 0.5rem;
  color: #718096;
  font-size: 0.875rem;
`;

const PageInfo = styled.span`
  color: #718096;
  font-size: 0.875rem;
  margin: 0 1rem;
`;

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}) => {
  if (totalPages <= 1) return null;

  // Gerar array de números de página para exibir
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      // Se total de páginas cabe na visualização, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica mais complexa para muitas páginas
      const halfVisible = Math.floor(maxVisible / 2);

      if (currentPage <= halfVisible + 1) {
        // Início: [1 2 3 4 5 ... 20]
        for (let i = 1; i <= maxVisible - 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - halfVisible) {
        // Fim: [1 ... 16 17 18 19 20]
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - (maxVisible - 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Meio: [1 ... 8 9 10 ... 20]
        pages.push(1);
        pages.push("...");
        for (
          let i = currentPage - halfVisible + 1;
          i <= currentPage + halfVisible - 1;
          i++
        ) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <PaginationContainer>
      {/* Botão Anterior */}
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        $disabled={currentPage === 1}
        disabled={currentPage === 1}
        title="Página anterior"
      >
        ← Anterior
      </PageButton>

      {/* Números de página */}
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
        ) : (
          <PageButton
            key={page}
            onClick={() => onPageChange(page as number)}
            $active={currentPage === page}
            title={`Ir para página ${page}`}
          >
            {page}
          </PageButton>
        ),
      )}

      {/* Botão Próxima */}
      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        $disabled={currentPage === totalPages}
        disabled={currentPage === totalPages}
        title="Próxima página"
      >
        Próxima →
      </PageButton>

      {/* Info de página */}
      <PageInfo>
        Página {currentPage} de {totalPages}
      </PageInfo>
    </PaginationContainer>
  );
};
