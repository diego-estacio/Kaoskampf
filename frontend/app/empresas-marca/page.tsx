"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MdBusiness, MdArrowBack } from "react-icons/md";
import EmpresaModal from "../../src/components/modals/ClientModal";
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
import {
  calcularStatusEmpresa,
  obterLabelStatus,
  obterCorStatus,
} from "../../src/utils/empresaStatusUtils";
import * as S from "../empresas/styles";
import styled from "styled-components";

// Breadcrumb Styles
const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #718096;
`;

const BreadcrumbItem = styled.span<{ $isActive?: boolean }>`
  color: ${(props) => (props.$isActive ? "#e2e8f0" : "#a0aec0")};
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  cursor: ${(props) => (props.$isActive ? "default" : "pointer")};

  &:hover {
    color: ${(props) => (props.$isActive ? "#e2e8f0" : "#a0aec0")};
  }
`;

const BreadcrumbSeparator = styled.span`
  color: #2d2d4e;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #1a1a2e;
  border: 1px solid #2d2d4e;
  border-radius: 0.5rem;
  color: #a0aec0;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #12121f;
    border-color: #2d2d4e;
  }
`;

function EmpresasMarcaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const marcaId = searchParams.get("marcaId");
  const marcaNome = searchParams.get("marcaNome") || "Marca";

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [contatosReais, setContatosReais] = useState<Contato[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filtrosAtivos, setFiltrosAtivos] = useState<EmpresaFilterState>({
    status: [],
    porte: [],
  });

  const loadContatos = useCallback(async () => {
    try {
      const contatos = await carregarContatos();
      setContatosReais(contatos);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      setContatosReais([]);
    }
  }, []);

  const loadEmpresas = useCallback(async () => {
    try {
      setIsLoading(true);

      // Se não houver marcaId, retornar vazio
      if (!marcaId) {
        setEmpresas([]);
        return;
      }

      // Buscar empresas específicas da marca usando a relação ManyToMany
      const data = await apiService.buscarEmpresasPorMarca(marcaId);

      // Mapear dados da API para o formato Empresa
      const empresasMapeadas: Empresa[] = data.map((empresa: any) => ({
        id: empresa.id,
        nome: empresa.nome,
        porte: empresa.porte,
        site: empresa.site || "",
        marcas: empresa.marcas || [],
        observacoes: empresa.observacoes || "",
        numeroContatos: empresa.contatos?.length || 0,
        status: empresa.status || 0,
      }));

      setEmpresas(empresasMapeadas);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
      // Em caso de erro, retornar array vazio
      setEmpresas([]);
    } finally {
      setIsLoading(false);
    }
  }, [marcaId]);

  useEffect(() => {
    loadEmpresas();
    loadContatos();
  }, [loadEmpresas, loadContatos]);

  const handleCreateClick = () => {
    setSelectedEmpresa(null);
    setIsModalOpen(true);
  };

  const handleEmpresaClick = (empresa: Empresa, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest(".action-button")) {
      return;
    }
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
    marcas?: string;
    observacoes?: string;
  }) => {
    try {
      if (selectedEmpresa) {
        await apiService.atualizarEmpresa(selectedEmpresa.id.toString(), {
          nome: empresaData.nome,
          porte: empresaData.porte as "pequeno" | "medio" | "grande",
          site: empresaData.site,
          // marcas agora é gerenciado via tabela de junção
          observacoes: empresaData.observacoes,
        });
      } else {
        await apiService.criarEmpresa({
          nome: empresaData.nome,
          porte: empresaData.porte as "pequeno" | "medio" | "grande",
          site: empresaData.site,
          // marcas agora é gerenciado via tabela de junção
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
    const contatosParaUsar =
      contatosReais.length > 0 ? contatosReais : mockData.contatos;
    return contatosParaUsar.filter(
      (c: Contato | { empresa?: string | { nome: string } }) =>
        (c as Contato).empresa?.nome === empresaNome ||
        (c as { empresa?: string }).empresa === empresaNome,
    );
  };

  // Aplicar filtros adicionais (empresas já vêm filtradas do backend por marca)
  const empresasFiltradas = empresas.filter((empresa) => {
    if (filtrosAtivos.status.length > 0) {
      const contatosEmpresa = getContatosDoEmpresa(empresa.nome);
      const statusEmpresa = calcularStatusEmpresa(
        contatosEmpresa as Array<{ status: string | number }>,
      );
      if (!filtrosAtivos.status.includes(statusEmpresa)) {
        return false;
      }
    }

    if (filtrosAtivos.porte.length > 0) {
      if (!filtrosAtivos.porte.includes(empresa.porte)) {
        return false;
      }
    }

    return true;
  });

  return (
    <PageContainer>
      <MainContent>
        <Breadcrumb>
          <BreadcrumbItem onClick={() => router.push("/painel")}>
            Dashboard
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem $isActive>{marcaNome}</BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem $isActive>Empresas</BreadcrumbItem>
        </Breadcrumb>

        <S.PageHeader>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <BackButton onClick={() => router.push("/painel")}>
              <MdArrowBack />
              Voltar
            </BackButton>
            <S.PageTitle>Empresas - {marcaNome}</S.PageTitle>
          </div>
          <S.PageHeaderActions>
            <EmpresaFilters onFilterChange={setFiltrosAtivos} />
            <S.AddButton onClick={handleCreateClick}>
              + Nova Empresa
            </S.AddButton>
          </S.PageHeaderActions>
        </S.PageHeader>

        <S.EmpresasGrid>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
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
                </div>
              </S.EmpresaCard>
            ))
          ) : empresasFiltradas.length === 0 ? (
            <S.EmptyState>
              <div className="icon">
                <MdBusiness />
              </div>
              <h3>Nenhuma empresa encontrada para {marcaNome}</h3>
              <p>
                Ainda não há empresas associadas a esta marca. Comece
                adicionando a primeira!
              </p>
              <S.AddButton onClick={handleCreateClick}>
                + Adicionar Primeira Empresa
              </S.AddButton>
            </S.EmptyState>
          ) : (
            empresasFiltradas.map((empresa) => {
              const contatosEmpresa = getContatosDoEmpresa(empresa.nome);
              const statusEmpresa = calcularStatusEmpresa(
                contatosEmpresa as Array<{ status: string | number }>,
              );
              const corStatus = obterCorStatus(statusEmpresa);

              return (
                <S.EmpresaCard
                  key={empresa.id}
                  $status={statusEmpresa}
                  onClick={(e) => handleEmpresaClick(empresa, e)}
                >
                  <S.EmpresaHeader>
                    <S.EmpresaName>{empresa.nome}</S.EmpresaName>
                  </S.EmpresaHeader>

                  <S.EmpresaInfo>
                    {empresa.site && (
                      <S.EmpresaSite>{empresa.site}</S.EmpresaSite>
                    )}
                  </S.EmpresaInfo>

                  <S.EmpresaStats>
                    <S.StatItem>
                      <S.StatNumber>{contatosEmpresa.length}</S.StatNumber>
                      <S.StatLabel>Contatos</S.StatLabel>
                    </S.StatItem>
                    <S.EmpresaPorte
                      $porte={obterLabelStatus(statusEmpresa)}
                      style={{
                        backgroundColor: corStatus.bg,
                        color: corStatus.text,
                      }}
                    >
                      {obterLabelStatus(statusEmpresa)}
                    </S.EmpresaPorte>
                  </S.EmpresaStats>

                  <S.EmpresaActions>
                    <S.ActionButton
                      className="secondary"
                      onClick={(e) => handleEditClick(empresa, e)}
                    >
                      Editar
                    </S.ActionButton>
                    <S.ActionButton
                      className="primary"
                      onClick={(e) => handleEmpresaClick(empresa, e)}
                    >
                      Ver Detalhes
                    </S.ActionButton>
                  </S.EmpresaActions>
                </S.EmpresaCard>
              );
            })
          )}
        </S.EmpresasGrid>
      </MainContent>

      <EmpresaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        empresa={selectedEmpresa}
        onSave={handleSaveEmpresa}
      />
    </PageContainer>
  );
}

// Loading component for Suspense fallback
function LoadingEmpresas() {
  return (
    <PageContainer>
      <MainContent>
        <S.PageHeader>
          <S.PageTitle>Carregando empresas...</S.PageTitle>
        </S.PageHeader>
        <S.EmpresasGrid>
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
            </S.EmpresaCard>
          ))}
        </S.EmpresasGrid>
      </MainContent>
    </PageContainer>
  );
}

// Wrap the component with Suspense boundary
export default function EmpresasMarcaPage() {
  return (
    <Suspense fallback={<LoadingEmpresas />}>
      <EmpresasMarcaContent />
    </Suspense>
  );
}
