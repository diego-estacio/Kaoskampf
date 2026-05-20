"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MdEmail,
  MdPhone,
  MdCheckCircle,
  MdComment,
  MdMoreVert,
  MdSearch,
} from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { LayoutGrid, Pencil, Rows3, Search } from "lucide-react";
import ContactModal from "../../src/components/modals/ContactModal";
import MarcarContatoModal from "../../src/components/modals/MarcarContatoModal";
import ContactFilters from "../../src/components/filters/ContactFilters";
import {
  PageContainer,
  MainContent,
} from "../../src/components/common/Layout.styles";
import * as S from "./styles";
import { ContactFormData } from "../../src/hooks/useContactForm";

import {
  Contato,
  ContatoFormData,
  carregarEmpresas,
  formDataParaContato,
  atualizarContatoAPI,
  criarContatoAPI,
  obterLabelStatus,
} from "../../src/utils/contatosUtils";
import ContactAttempts from "../../src/components/common/ContactAttempts";
import { useContatos } from "../../src/hooks/useContatos";
import { useMarcarContato } from "../../src/hooks/useMarcarContato";
import { calcularDiasProximoContato } from "../../src/utils/contactUtils";
import { filtrarContatosAvancado } from "../../src/utils/filterUtils";
import { FiltrosContato } from "../../src/components/filters/ContactFilters/types";
import { apiService } from "../../src/services/api";
import { usePagination } from "../../src/hooks/usePagination";
import { useAuthStore } from "../../src/stores/authStore";

interface ContatosPageProps {
  tipoContatoFilter?: "lead" | "cliente";
}

export function ContatosPageBase({ tipoContatoFilter }: ContatosPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empresas, setEmpresas] = useState<{ id: string; nome: string }[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [menuContatoId, setMenuContatoId] = useState<string | null>(null);
  const [empresasMarcaNomes, setEmpresasMarcaNomes] = useState<string[]>([]);

  const marcaId = searchParams.get("marcaId");
  const marcaNome = searchParams.get("marcaNome");

  // Estado dos filtros avançados
  const [filtros, setFiltros] = useState<FiltrosContato>({
    status: [],
    temperaturas: [],
  });
  const currentUser = useAuthStore((state) => state.usuario);
  // Por padrão, sempre começa vendo apenas os próprios (conforme solicitado pelo usuário agora)
  const [mostrarTodosContatos, setMostrarTodosContatos] = useState(false);

  const [buscaNome, setBuscaNome] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Hooks customizados
  const { contatos, loading, loadContatos, reloadContatos } = useContatos();
  const {
    isModalOpen: isMarcarContatoModalOpen,
    numeroTentativa,
    handleOpenModal: handleOpenMarcarContato,
    handleCloseModal: handleCloseMarcarContato,
    handleConfirmarMarcacao,
  } = useMarcarContato();

  useEffect(() => {
    loadContatos();
    loadEmpresas();

    const loadEmpresasPorMarca = async (id: string) => {
      try {
        const data = await apiService.buscarEmpresasPorMarca(id);
        const nomes = (data || [])
          .map((empresa: any) => empresa.nome)
          .filter(Boolean);
        setEmpresasMarcaNomes(nomes);
      } catch (error) {
        console.error("Erro ao carregar empresas da marca:", error);
        setEmpresasMarcaNomes([]);
      }
    };

    if (marcaId) {
      loadEmpresasPorMarca(marcaId);
    } else {
      setEmpresasMarcaNomes([]);
    }
  }, [loadContatos, marcaId]);

  const loadEmpresas = async () => {
    const empresasCarregadas = await carregarEmpresas();
    setEmpresas(empresasCarregadas);
  };

  // Usar filtro avançado
  const contatosOrdenados = [...contatos].sort((a, b) => {
    return (b.criadoEm ?? "")!.localeCompare(a.criadoEm ?? "");
  });
  let contatosFiltrados = filtrarContatosAvancado(contatosOrdenados, filtros);

  // Se vier marcaId na URL e conseguirmos carregar empresas da marca,
  // filtrar contatos apenas das empresas associadas a essa marca.
  if (marcaId && empresasMarcaNomes.length > 0) {
    contatosFiltrados = contatosFiltrados.filter((contato) =>
      empresasMarcaNomes.includes(contato.empresa?.nome),
    );
  }

  if (buscaNome.trim()) {
    const termo = buscaNome.toLowerCase();
    contatosFiltrados = contatosFiltrados.filter((contato) => {
      const nomeContato = (contato.nome || "").toLowerCase();
      const nomeEmpresa = (contato.empresa?.nome || "").toLowerCase();
      return nomeContato.includes(termo) || nomeEmpresa.includes(termo);
    });
  }

  let contatosVisiveis = tipoContatoFilter
    ? contatosFiltrados.filter(
        (contato) => (contato.tipoContato || "lead") === tipoContatoFilter,
      )
    : contatosFiltrados;

  // Resetar página quando mudar filtros ou busca
  useEffect(() => {
    setCurrentPage(1);
  }, [filtros, buscaNome, mostrarTodosContatos]);

  // Filtrar por criador se "mostrarTodosContatos" for falso
  if (!mostrarTodosContatos && currentUser) {
    const myId = (
      currentUser.id ||
      (currentUser as any).uuid ||
      (currentUser as any).sub ||
      ""
    )
      .toString()
      .toLowerCase()
      .trim();

    contatosVisiveis = contatosVisiveis.filter((c: any) => {
      // Usar o ID do criador que mapeamos no contatosUtils
      const creatorId = (c.usuarioCriadorId || "")
        .toString()
        .toLowerCase()
        .trim();

      // 1. Se bater o ID do criador com o meu ID
      if (myId && creatorId === myId) return true;

      // Por padrão, se não bater o ID, não mostra (mesmo que seja nulo)
      // Para ver todos (incluindo sem dono), o usuário deve ativar o toggle "Mostrar todos"
      return false;
    });
  }

  const tituloBase =
    tipoContatoFilter === "cliente"
      ? "Clientes"
      : tipoContatoFilter === "lead"
        ? "Leads"
        : "Contatos";

  const tituloPagina = marcaNome ? `${tituloBase} - ${marcaNome}` : tituloBase;

  const {
    items: contatosGridPaginados,
    page: paginaGrid,
    totalPages: totalPaginasGrid,
    totalItems: totalGrid,
    setPage: setPaginaGrid,
  } = usePagination(contatosVisiveis, 9);

  const {
    items: contatosListaPaginados,
    page: paginaLista,
    totalPages: totalPaginasLista,
    totalItems: totalLista,
    setPage: setPaginaLista,
  } = usePagination(contatosVisiveis, 10);

  const handleContatoClick = (contato: Contato) => {
    console.log("🖱️ DEBUG - handleContatoClick (ver detalhes):", { contato });
    router.push(`/contatos/${contato.id}`);
  };

  const handleEditClick = (contato: Contato, e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique no card seja acionado
    console.log("✏️ DEBUG - handleEditClick:", { contato });
    setSelectedContato(contato);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedContato(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContato(null);
  };

  const handleToggleMenu = (contato: Contato, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuContatoId((current) => (current === contato.id ? null : contato.id));
  };

  const handleToggleTipoContato = async (contato: Contato) => {
    const tipoAtual = contato.tipoContato || "lead";
    const proximoTipo = tipoAtual === "lead" ? "cliente" : "lead";

    const confirmado = window.confirm(
      tipoAtual === "lead"
        ? "Promover este lead para cliente?"
        : "Voltar este cliente para lead?",
    );
    if (!confirmado) return;

    try {
      await apiService.atualizarTipoContato(contato.id, proximoTipo);
      await reloadContatos();
      window.alert(
        proximoTipo === "cliente"
          ? "Contato promovido para cliente com sucesso."
          : "Contato retornado para lead com sucesso.",
      );
    } catch (error) {
      console.error("Erro ao atualizar tipoContato:", error);
      window.alert("Erro ao atualizar tipo do contato. Tente novamente.");
    } finally {
      setMenuContatoId(null);
    }
  };

  const handleDeleteContato = async (contato: Contato) => {
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir o contato "${contato.nome}"? Essa ação não pode ser desfeita.`,
    );
    if (!confirmado) return;

    try {
      await apiService.deletarContato(contato.id);
      await reloadContatos();
      window.alert("Contato excluído com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      window.alert("Erro ao excluir contato. Tente novamente.");
    } finally {
      setMenuContatoId(null);
    }
  };

  const handleSaveContact = async (formData: ContactFormData) => {
    // Converter para ContatoFormData adicionando leadTemperatura
    const contatoFormData: ContatoFormData = {
      ...formData,
      linkedin: formData.linkedin || "",
      leadTemperatura: formData.lead, // Será recalculado pelo backend
    };

    // Definir tipoContato na criação com base na tela atual
    // - Tela de clientes: sempre criar como "cliente"
    // - Tela de leads (ou lista geral): criar como "lead" por padrão
    if (!selectedContato) {
      contatoFormData.tipoContato =
        tipoContatoFilter === "cliente" ? "cliente" : "lead";
    }

    try {
      if (selectedContato) {
        // EDITAR contato existente
        const contatoAtualizado = formDataParaContato(
          contatoFormData,
          selectedContato,
        );
        await atualizarContatoAPI(selectedContato, contatoAtualizado);
        await reloadContatos();
      } else {
        // CRIAR novo contato
        const empresaExistente = empresas.find(
          (c) => c.nome === contatoFormData.empresa,
        );

        await criarContatoAPI(contatoFormData, empresas);
        await reloadContatos();

        if (!empresaExistente) {
          await loadEmpresas();
        }
      }

      setIsModalOpen(false);
      setSelectedContato(null);
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
      throw error;
    }
  };

  // Handler para abrir modal de marcar contato
  const handleMarcarContatoClick = (contato: Contato, e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique no card seja acionado
    handleOpenMarcarContato(contato);
  };

  // Handler com callback de reload
  const handleConfirmarMarcacaoComReload = async (
    observacao: string,
    via: string,
  ) => {
    await handleConfirmarMarcacao(observacao, via, reloadContatos);
  };

  return (
    <PageContainer onClick={() => setMenuContatoId(null)}>
      <MainContent>
        <S.PageHeader>
          <S.PageTitle>{tituloPagina}</S.PageTitle>
          <S.PageActions>
            <S.SearchContainer>
              <Search size={16} />
              <S.SearchInput
                type="text"
                placeholder="Buscar por nome..."
                value={buscaNome}
                onChange={(e) => setBuscaNome(e.target.value)}
              />
            </S.SearchContainer>
            <ContactFilters
              filtros={filtros}
              onFiltrosChange={setFiltros}
              totalResultados={contatosVisiveis.length}
              mostrarTemperatura={tipoContatoFilter !== "cliente"}
              mostrarToggleTodos={true}
              mostrarTodos={mostrarTodosContatos}
              onMostrarTodosChange={setMostrarTodosContatos}
            />
            <S.ViewToggle>
              <S.ViewButton
                $active={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                title="Visualização em Grid"
              >
                <LayoutGrid size={18} />
              </S.ViewButton>
              <S.ViewButton
                $active={viewMode === "list"}
                onClick={() => setViewMode("list")}
                title="Visualização em Lista"
              >
                <Rows3 size={18} />
              </S.ViewButton>
            </S.ViewToggle>
            <S.AddButton onClick={handleCreateClick}>
              + Novo Contato
            </S.AddButton>
          </S.PageActions>
        </S.PageHeader>

        {viewMode === "grid" ? (
          <>
            <S.ContactsGrid>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <S.ContactCard key={index}>
                    <div
                      style={{
                        background: "#1e1e3a",
                        height: "20px",
                        borderRadius: "4px",
                        marginBottom: "10px",
                      }}
                    ></div>
                    <div
                      style={{
                        background: "#1e1e3a",
                        height: "16px",
                        borderRadius: "4px",
                        width: "60%",
                        marginBottom: "20px",
                      }}
                    ></div>
                    <div
                      style={{
                        background: "#1e1e3a",
                        height: "40px",
                        borderRadius: "4px",
                      }}
                    ></div>
                  </S.ContactCard>
                ))
              ) : contatosVisiveis.length === 0 ? (
                <S.EmptyState>
                  <div className="icon">👥</div>
                  <h3>Nenhum contato encontrado</h3>
                  <p>Comece adicionando seus primeiros contatos e leads</p>
                  <S.AddButton onClick={handleCreateClick}>
                    + Adicionar Primeiro Contato
                  </S.AddButton>
                </S.EmptyState>
              ) : (
                contatosGridPaginados.map((contato) => {
                  const tipoContato = contato.tipoContato || "lead";
                  const isLeadContato = tipoContato === "lead";
                  const leadTemperatureUI = isLeadContato
                    ? contato.leadTemperatura
                    : "default";

                  return (
                    <S.ContactCard
                      key={contato.id}
                      $leadTemperature={leadTemperatureUI}
                      onClick={() => handleContatoClick(contato)}
                    >
                      <S.ContactHeader>
                        <S.ContactInfo>
                          <S.ContactName>{contato.nome}</S.ContactName>
                          <S.ContactCompany>
                            {contato.empresa?.nome || "Empresa não informada"}
                          </S.ContactCompany>
                          <S.ContactRole>{contato.cargo}</S.ContactRole>
                        </S.ContactInfo>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <S.ContactStatus
                            $status={
                              isLeadContato ? leadTemperatureUI : contato.status
                            }
                          >
                            {obterLabelStatus(contato.status)}
                          </S.ContactStatus>
                          <button
                            type="button"
                            onClick={(e) => handleToggleMenu(contato, e)}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: 4,
                              borderRadius: 4,
                            }}
                          >
                            <MdMoreVert size={18} />
                          </button>
                        </div>
                      </S.ContactHeader>

                      <S.ContactDetails>
                        {contato.email && (
                          <S.ContactField>
                            <S.FieldIcon>
                              <MdEmail />
                            </S.FieldIcon>
                            {contato.email}
                          </S.ContactField>
                        )}
                        <S.ContactField>
                          <S.FieldIcon>
                            <MdPhone />
                          </S.FieldIcon>
                          {contato.telefone}
                        </S.ContactField>
                        {contato.contatos?.linkedin && (
                          <S.ContactField>
                            <S.FieldIcon>
                              <FaLinkedin />
                            </S.FieldIcon>
                            <a
                              href={contato.contatos.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                color: "#0077b5",
                                textDecoration: "none",
                              }}
                            >
                              LinkedIn
                            </a>
                          </S.ContactField>
                        )}
                        {contato.observacoes && (
                          <S.ContactField>
                            <S.FieldIcon>
                              <MdComment />
                            </S.FieldIcon>
                            {contato.observacoes}
                          </S.ContactField>
                        )}
                      </S.ContactDetails>

                      <S.ContactActions>
                        <S.ActionButton
                          className="primary"
                          onClick={(e) => handleEditClick(contato, e)}
                        >
                          <Pencil size={14} /> Editar
                        </S.ActionButton>

                        <S.ActionButton>
                          <MdSearch size={16} /> Detalhes
                        </S.ActionButton>
                      </S.ContactActions>
                      {menuContatoId === contato.id && (
                        <div
                          style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            background: "white",
                            borderRadius: 8,
                            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
                            padding: "0.5rem",
                            zIndex: 10,
                            minWidth: 180,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "0.4rem 0.6rem",
                              border: "none",
                              background: "transparent",
                              textAlign: "left",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                            }}
                            onClick={() => handleToggleTipoContato(contato)}
                          >
                            {isLeadContato
                              ? "Promover para cliente"
                              : "Voltar para lead"}
                          </button>
                          <button
                            type="button"
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "0.4rem 0.6rem",
                              border: "none",
                              background: "transparent",
                              textAlign: "left",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                              color: "#ef4444",
                            }}
                            onClick={() => handleDeleteContato(contato)}
                          >
                            Excluir contato
                          </button>
                        </div>
                      )}
                      {isLeadContato && (
                        <>
                          <ContactAttempts
                            contatoId={contato.id}
                            showMode="card"
                            size="small"
                            numeroContatos={contato.numeroContatos || 0}
                          />
                          <div
                            className="flex-contact"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <S.ActionButton
                              className="contato"
                              onClick={(e) =>
                                handleMarcarContatoClick(contato, e)
                              }
                            >
                              <MdCheckCircle /> Marcar Contato
                            </S.ActionButton>

                            <S.LastContact>
                              Próxima tentativa:{" "}
                              {calcularDiasProximoContato(
                                contato.proximoContato,
                              )}
                            </S.LastContact>
                          </div>
                        </>
                      )}
                    </S.ContactCard>
                  );
                })
              )}
            </S.ContactsGrid>

            {totalGrid > 0 && !loading && (
              <S.PaginationBar>
                <span>
                  Página {paginaGrid} de {totalPaginasGrid}
                </span>
                <S.SecondaryButton
                  type="button"
                  onClick={() => setPaginaGrid(paginaGrid - 1)}
                  disabled={paginaGrid <= 1}
                >
                  Anterior
                </S.SecondaryButton>
                <S.SecondaryButton
                  type="button"
                  onClick={() => setPaginaGrid(paginaGrid + 1)}
                  disabled={paginaGrid >= totalPaginasGrid}
                >
                  Próxima
                </S.SecondaryButton>
              </S.PaginationBar>
            )}
          </>
        ) : (
          <>
            <S.ContactsList>
              {loading ? (
                <S.LoadingText>Carregando contatos...</S.LoadingText>
              ) : contatosVisiveis.length === 0 ? (
                <S.EmptyState>
                  <div className="icon">👥</div>
                  <h3>Nenhum contato encontrado</h3>
                  <p>Comece adicionando seus primeiros contatos e leads</p>
                  <S.AddButton onClick={handleCreateClick}>
                    + Adicionar Primeiro Contato
                  </S.AddButton>
                </S.EmptyState>
              ) : (
                contatosListaPaginados.map((contato) => {
                  const tipoContato = contato.tipoContato || "lead";
                  const isLeadContato = tipoContato === "lead";
                  const leadTemperatureUI = isLeadContato
                    ? contato.leadTemperatura
                    : "default";

                  return (
                    <S.ContactListItem
                      key={contato.id}
                      $leadTemperature={leadTemperatureUI}
                      onClick={() => handleContatoClick(contato)}
                    >
                      <S.ListItemContent>
                        <S.ListItemMain>
                          <S.ListItemName>{contato.nome}</S.ListItemName>
                          <S.ListItemCompany>
                            {contato.empresa?.nome || "Empresa não informada"}
                          </S.ListItemCompany>
                        </S.ListItemMain>
                        <S.ListItemDetail>
                          <S.ContactField>
                            <MdEmail size={16} />
                            {contato.email}
                          </S.ContactField>
                        </S.ListItemDetail>
                        <S.ListItemDetail>
                          <S.ContactField>
                            <MdPhone size={16} />
                            {contato.telefone}
                          </S.ContactField>
                        </S.ListItemDetail>
                        <S.ListItemStatus
                          $status={
                            isLeadContato ? leadTemperatureUI : contato.status
                          }
                        >
                          {obterLabelStatus(contato.status)}
                        </S.ListItemStatus>
                        <S.ListItemDate>
                          {isLeadContato
                            ? calcularDiasProximoContato(contato.proximoContato)
                            : "-"}
                        </S.ListItemDate>
                        <S.ListItemActions>
                          <S.ActionButton
                            className="small"
                            onClick={(e) => handleToggleMenu(contato, e)}
                          >
                            <MdMoreVert size={16} />
                          </S.ActionButton>
                          {isLeadContato && (
                            <S.ActionButton
                              className="small"
                              onClick={(e) =>
                                handleMarcarContatoClick(contato, e)
                              }
                            >
                              <MdCheckCircle size={16} />
                            </S.ActionButton>
                          )}
                          <S.ActionButton
                            className="small"
                            onClick={(e) => handleEditClick(contato, e)}
                          >
                            Editar
                          </S.ActionButton>
                        </S.ListItemActions>
                      </S.ListItemContent>
                      {menuContatoId === contato.id && (
                        <div
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 16,
                            background: "white",
                            borderRadius: 8,
                            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
                            padding: "0.5rem",
                            zIndex: 10,
                            minWidth: 180,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "0.4rem 0.6rem",
                              border: "none",
                              background: "transparent",
                              textAlign: "left",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                            }}
                            onClick={() => handleToggleTipoContato(contato)}
                          >
                            {isLeadContato
                              ? "Promover para cliente"
                              : "Voltar para lead"}
                          </button>
                          <button
                            type="button"
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "0.4rem 0.6rem",
                              border: "none",
                              background: "transparent",
                              textAlign: "left",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                              color: "#ef4444",
                            }}
                            onClick={() => handleDeleteContato(contato)}
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </S.ContactListItem>
                  );
                })
              )}
            </S.ContactsList>

            {totalLista > 0 && !loading && (
              <S.PaginationBar>
                <span>
                  Página {paginaLista} de {totalPaginasLista}
                </span>
                <S.SecondaryButton
                  type="button"
                  onClick={() => setPaginaLista(paginaLista - 1)}
                  disabled={paginaLista <= 1}
                >
                  Anterior
                </S.SecondaryButton>
                <S.SecondaryButton
                  type="button"
                  onClick={() => setPaginaLista(paginaLista + 1)}
                  disabled={paginaLista >= totalPaginasLista}
                >
                  Próxima
                </S.SecondaryButton>
              </S.PaginationBar>
            )}
          </>
        )}
      </MainContent>

      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contact={selectedContato || null}
        empresas={empresas}
        onSave={handleSaveContact}
      />

      {/* Modal de Marcar Contato */}
      <MarcarContatoModal
        isOpen={isMarcarContatoModalOpen}
        onClose={handleCloseMarcarContato}
        onConfirm={handleConfirmarMarcacaoComReload}
        numeroTentativa={numeroTentativa}
      />
    </PageContainer>
  );
}

export default function ContatosPage() {
  return (
    <Suspense fallback={<div>Carregando contatos...</div>}>
      <ContatosPageBase />
    </Suspense>
  );
}
