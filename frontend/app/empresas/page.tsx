"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import EmpresaModal from "../../src/components/modals/ClientModal";
import ViewToggle, { ViewMode } from "../../src/components/common/ViewToggle";
import { EmpresaCard, EmpresaListItem } from "../../src/components/clients";
import {
  EmpresaFilters,
  EmpresaFilterState,
} from "../../src/components/filters/EmpresaFilters";
import { apiService } from "../../src/services/api";
import {
  PageContainer,
  MainContent,
} from "../../src/components/common/Layout.styles";
import { mockData } from "../../src/utils";
import {
  Contato,
  Empresa,
  carregarContatos,
} from "../../src/utils/contatosUtils";
import { calcularStatusEmpresa } from "../../src/utils/empresaStatusUtils";
import { usePagination } from "../../src/hooks/usePagination";
import * as S from "./styles";

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [contatosReais, setContatosReais] = useState<Contato[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filtrosAtivos, setFiltrosAtivos] = useState<EmpresaFilterState>({
    status: [],
    porte: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadEmpresas();
    loadContatos();
  }, []);

  const loadContatos = async () => {
    try {
      const contatos = await carregarContatos();
      setContatosReais(contatos);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      // Em caso de erro, usar dados mock
      setContatosReais([]);
    }
  };

  const loadEmpresas = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.buscarEmpresas();

      // Mapear dados da API para o formato Empresa
      const empresasMapeadas: Empresa[] = data.map((empresa) => ({
        id: empresa.id,
        nome: empresa.nome,
        porte: empresa.porte,
        site: empresa.site || "",
        marcas: empresa.marcas || [], // Array de marcas (novo modelo)
        observacoes: empresa.observacoes || "",
        numeroContatos: empresa.contatos?.length || 0,
        status: empresa.status || 0,
      }));

      setEmpresas(empresasMapeadas);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
      // Fallback para dados mock
      setEmpresas(
        mockData.empresas.map((e) => ({
          id: e.id.toString(),
          nome: e.nome,
          porte: e.porte as "pequeno" | "medio" | "grande",
          site: e.site,
          marcas: [], // Mock não tem marcas separadas, usar array vazio
          observacoes: e.observacoes,
          numeroContatos: e.contatos,
          status: e.status,
        })),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedEmpresa(null);
    setIsModalOpen(true);
  };

  const handleEmpresaClick = (empresa: Empresa, event: React.MouseEvent) => {
    // Se clicou em um botão de ação específico, não redireciona
    if ((event.target as HTMLElement).closest(".action-button")) {
      return;
    }

    // Redirecionar para a página de detalhes da empresa
    window.location.href = `/empresas/${empresa.id}`;
  };

  const handleEditClick = (empresa: Empresa, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedEmpresa(empresa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmpresa(null);
  };

  const handleSaveEmpresa = async (empresaData: {
    nome: string;
    porte: string;
    site?: string;
    marcaIds?: number[];
    observacoes?: string;
  }) => {
    try {
      if (selectedEmpresa) {
        await apiService.atualizarEmpresa(selectedEmpresa.id.toString(), {
          nome: empresaData.nome,
          porte: empresaData.porte as "pequeno" | "medio" | "grande",
          site: empresaData.site,
          marcaIds: empresaData.marcaIds,
          observacoes: empresaData.observacoes,
        });
      } else {
        await apiService.criarEmpresa({
          nome: empresaData.nome,
          porte: empresaData.porte as "pequeno" | "medio" | "grande",
          site: empresaData.site,
          marcaIds: empresaData.marcaIds,
          observacoes: empresaData.observacoes,
        });
      }

      // Recarregar da API para ter dados atualizados
      await loadEmpresas();
      setIsModalOpen(false);
      setSelectedEmpresa(null);
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);
      throw error;
    }
  };

  const getContatosDoEmpresa = (empresaNome: string) => {
    // Priorizar contatos reais do backend, fallback para mock
    const contatosParaUsar =
      contatosReais.length > 0 ? contatosReais : mockData.contatos;
    return contatosParaUsar.filter(
      (c: any) => c.empresa?.nome === empresaNome || c.empresa === empresaNome,
    );
  };

  // Função para filtrar empresas baseado nos filtros ativos
  const empresasFiltradas = empresas.filter((empresa) => {
    // Filtro de status
    if (filtrosAtivos.status.length > 0) {
      const contatosEmpresa = getContatosDoEmpresa(empresa.nome);
      const statusEmpresa = calcularStatusEmpresa(contatosEmpresa);
      if (!filtrosAtivos.status.includes(statusEmpresa)) {
        return false;
      }
    }

    // Filtro de porte
    if (filtrosAtivos.porte.length > 0) {
      if (!filtrosAtivos.porte.includes(empresa.porte)) {
        return false;
      }
    }

    // Filtro de busca por nome
    if (searchTerm.trim()) {
      const termo = searchTerm.toLowerCase();
      if (!empresa.nome.toLowerCase().includes(termo)) {
        return false;
      }
    }

    return true;
  });

  const {
    items: empresasPaginadas,
    page: paginaEmpresas,
    totalPages: totalPaginasEmpresas,
    totalItems: totalEmpresas,
    setPage: setPaginaEmpresas,
  } = usePagination(empresasFiltradas, 9);

  return (
    <PageContainer>
      <MainContent>
        <S.PageHeader>
          <S.PageTitle>Empresas</S.PageTitle>
          <S.PageHeaderActions>
            <S.SearchContainer>
              <Search size={16} />
              <S.SearchInput
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </S.SearchContainer>
            <EmpresaFilters onFilterChange={setFiltrosAtivos} />
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            <S.AddButton onClick={handleCreateClick}>
              + Nova Empresa
            </S.AddButton>
          </S.PageHeaderActions>
        </S.PageHeader>

        {isLoading ? (
          <S.EmpresasGrid>
            {/* Skeleton Loading */}
            {Array.from({ length: 6 }).map((_, index) => (
              <S.EmpresaCard key={`skeleton-${index}`}>
                <div
                  style={{
                    background: "#1e1e3a",
                    height: "24px",
                    borderRadius: "4px",
                    marginBottom: "12px",
                    width: "70%",
                  }}
                ></div>
                <div
                  style={{
                    background: "#1e1e3a",
                    height: "16px",
                    borderRadius: "4px",
                    width: "50%",
                    marginBottom: "20px",
                  }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      background: "#1e1e3a",
                      height: "40px",
                      borderRadius: "4px",
                      flex: 1,
                    }}
                  ></div>
                  <div
                    style={{
                      background: "#1e1e3a",
                      height: "40px",
                      borderRadius: "4px",
                      flex: 1,
                    }}
                  ></div>

                  <div
                    style={{
                      background: "#1e1e3a",
                      height: "32px",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
              </S.EmpresaCard>
            ))}
          </S.EmpresasGrid>
        ) : empresasFiltradas.length === 0 ? (
          <S.EmpresasGrid>
            <S.EmptyState>
              <div className="icon">
                <MdBusiness />
              </div>
              <h3>
                {empresas.length === 0
                  ? "Nenhuma empresa cadastrada"
                  : "Nenhuma empresa encontrada com os filtros aplicados"}
              </h3>
              <p>
                {empresas.length === 0
                  ? "Comece adicionando sua primeira empresa"
                  : "Tente ajustar os filtros para ver mais resultados"}
              </p>
              {empresas.length === 0 && (
                <S.AddButton onClick={handleCreateClick}>
                  + Adicionar Primeira Empresa
                </S.AddButton>
              )}
            </S.EmptyState>
          </S.EmpresasGrid>
        ) : viewMode === "grid" ? (
          <>
            <S.EmpresasGrid>
              {empresasPaginadas.map((empresa) => {
                const contatosEmpresa = getContatosDoEmpresa(empresa.nome);
                const clientesEmpresa = contatosEmpresa.filter(
                  (c) => c.tipoContato === "cliente",
                );
                const leadsEmpresa = contatosEmpresa.filter(
                  (c) => c.tipoContato === "lead",
                );
                const statusEmpresa = calcularStatusEmpresa(contatosEmpresa);

                return (
                  <EmpresaCard
                    key={empresa.id}
                    empresa={empresa}
                    numeroClientes={clientesEmpresa.length}
                    numeroLeads={leadsEmpresa.length}
                    statusEmpresa={statusEmpresa}
                    onEdit={(e) => handleEditClick(empresa, e)}
                    onClick={(e) => handleEmpresaClick(empresa, e)}
                  />
                );
              })}
            </S.EmpresasGrid>

            {totalEmpresas > 0 && (
              <S.PaginationBar>
                <span>
                  Página {paginaEmpresas} de {totalPaginasEmpresas}
                </span>
                <S.SecondaryButton
                  type="button"
                  onClick={() => setPaginaEmpresas(paginaEmpresas - 1)}
                  disabled={paginaEmpresas <= 1}
                >
                  Anterior
                </S.SecondaryButton>
                <S.SecondaryButton
                  type="button"
                  onClick={() => setPaginaEmpresas(paginaEmpresas + 1)}
                  disabled={paginaEmpresas >= totalPaginasEmpresas}
                >
                  Próxima
                </S.SecondaryButton>
              </S.PaginationBar>
            )}
          </>
        ) : (
          <>
            <S.EmpresasList>
              {empresasPaginadas.map((empresa) => {
                const contatosEmpresa = getContatosDoEmpresa(empresa.nome);
                const clientesEmpresa = contatosEmpresa.filter(
                  (c) => c.tipoContato === "cliente",
                );
                const leadsEmpresa = contatosEmpresa.filter(
                  (c) => c.tipoContato === "lead",
                );
                const statusEmpresa = calcularStatusEmpresa(contatosEmpresa);

                return (
                  <EmpresaListItem
                    key={empresa.id}
                    empresa={empresa}
                    numeroClientes={clientesEmpresa.length}
                    numeroLeads={leadsEmpresa.length}
                    statusEmpresa={statusEmpresa}
                    onEdit={(e) => handleEditClick(empresa, e)}
                    onClick={(e) => handleEmpresaClick(empresa, e)}
                  />
                );
              })}
            </S.EmpresasList>

            {totalEmpresas > 0 && (
              <S.PaginationBar>
                <span>
                  Página {paginaEmpresas} de {totalPaginasEmpresas}
                </span>
                <S.SecondaryButton
                  type="button"
                  onClick={() => setPaginaEmpresas(paginaEmpresas - 1)}
                  disabled={paginaEmpresas <= 1}
                >
                  Anterior
                </S.SecondaryButton>
                <S.SecondaryButton
                  type="button"
                  onClick={() => setPaginaEmpresas(paginaEmpresas + 1)}
                  disabled={paginaEmpresas >= totalPaginasEmpresas}
                >
                  Próxima
                </S.SecondaryButton>
              </S.PaginationBar>
            )}
          </>
        )}
      </MainContent>

      {/* Modal Unificado de Empresa */}
      <EmpresaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        empresa={selectedEmpresa}
        onSave={handleSaveEmpresa}
      />
    </PageContainer>
  );
}
