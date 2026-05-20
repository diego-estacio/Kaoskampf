"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PageContainer,
  MainContent,
} from "../../src/components/common/Layout.styles";
import Modal from "../../src/components/common/Modal";
import { apiService } from "../../src/services/api";
import { ComboBox } from "./ComboBox";
import { usePagination } from "../../src/hooks/usePagination";
import {
  CatalogoItem,
  Contato,
  Empresa,
  Marca,
  MoedaProposta,
  Proposta,
  StatusProposta,
} from "../../src/types";
import * as S from "./styles";
import { NewProposalForm } from "./NewProposalForm";
import { EditProposalForm } from "./EditProposalForm";

const STATUS_LABELS: Record<StatusProposta, string> = {
  rascunho: "Rascunho",
  enviada: "Enviada",
  visualizada: "Visualizada",
  aprovada: "Aprovada",
  recusada: "Recusada",
  expirada: "Expirada",
};

export default function PropostasClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [contatoIdSelecionado, setContatoIdSelecionado] = useState<string>("");
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<"todas" | StatusProposta>(
    "todas",
  );
  const [carregandoPropostas, setCarregandoPropostas] = useState(false);

  // Filtros sequenciais da listagem (marca -> empresa -> contato)
  const [marcaIdFiltro, setMarcaIdFiltro] = useState<number | null>(null);

  const [empresasFiltro, setEmpresasFiltro] = useState<Empresa[]>([]);
  const [empresaIdFiltro, setEmpresaIdFiltro] = useState<string>("");

  const [contatosFiltro, setContatosFiltro] = useState<Contato[]>([]);
  const [carregandoContatosLista, setCarregandoContatosLista] = useState(false);

  // Nova proposta
  const [criando, setCriando] = useState(false);
  const [retornarParaContatoId, setRetornarParaContatoId] = useState<
    string | null
  >(null);

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [filtroMarcas] = useState("");

  const [novaDefaults, setNovaDefaults] = useState<{
    contatoId?: string;
    empresaId?: string;
    marcaId?: number | null;
  } | null>(null);

  const [propostaSelecionada, setPropostaSelecionada] =
    useState<Proposta | null>(null);

  const [openIA, setOpenIA] = useState(false);

  // Estado para edição de proposta
  const [editandoProposta, setEditandoProposta] = useState<string | null>(null);

  // Inicializar filtros e formulário de nova proposta a partir da URL
  useEffect(() => {
    const contatoId = searchParams.get("contatoId");
    const novaFlag = searchParams.get("nova");
    const iaFlag = searchParams.get("ia");

    if (!contatoId) {
      // Handle ?nova=1&ia=1 without contatoId (from FAB)
      if (novaFlag === "1") {
        setCriando(true);
        if (iaFlag === "1") {
          setOpenIA(true);
        }
      }
      return;
    }

    setContatoIdSelecionado(contatoId);
    setRetornarParaContatoId(contatoId);

    const inicializarParaContato = async () => {
      try {
        const contato = await apiService.buscarContato(contatoId);

        if (contato.empresaId) {
          setEmpresaIdFiltro(contato.empresaId);
        }

        const primeiraMarca = contato.empresa?.marcas?.[0];
        if (primeiraMarca) {
          setMarcaIdFiltro(primeiraMarca.id);
        }

        setNovaDefaults({
          contatoId,
          empresaId: contato.empresaId || "",
          marcaId: primeiraMarca ? primeiraMarca.id : null,
        });

        if (novaFlag === "1") {
          setCriando(true);
        }
      } catch (error) {
        console.error(
          "Erro ao inicializar proposta a partir do contato",
          error,
        );
      }
    };

    inicializarParaContato();
  }, [searchParams]);

  useEffect(() => {
    const carregarMarcas = async () => {
      try {
        const lista = await apiService.buscarMarcas();
        setMarcas(lista || []);
      } catch (error) {
        console.error("Erro ao carregar marcas", error);
      }
    };

    carregarMarcas();
  }, []);

  // Filtros da listagem: carregar empresas com base na marca (ou todas se marca nula)
  useEffect(() => {
    const carregarEmpresasFiltro = async () => {
      try {
        if (marcaIdFiltro) {
          const lista = await apiService.buscarEmpresasPorMarca(
            String(marcaIdFiltro),
          );
          setEmpresasFiltro(lista || []);
        } else {
          const lista = await apiService.buscarEmpresas();
          setEmpresasFiltro(lista || []);
        }
      } catch (error) {
        console.error("Erro ao carregar empresas para filtros", error);
      }
    };

    carregarEmpresasFiltro();
  }, [marcaIdFiltro]);

  // Filtros da listagem: carregar contatos com base na empresa
  useEffect(() => {
    if (!empresaIdFiltro) {
      setContatosFiltro([]);
      setContatoIdSelecionado("");
      return;
    }

    const carregarContatos = async () => {
      setCarregandoContatosLista(true);
      try {
        const lista = await apiService.filtrarContatos({
          empresaId: empresaIdFiltro,
        });
        setContatosFiltro(lista || []);
      } catch (error) {
        console.error("Erro ao carregar contatos para filtros", error);
      } finally {
        setCarregandoContatosLista(false);
      }
    };

    carregarContatos();
  }, [empresaIdFiltro]);

  const carregarPropostas = async () => {
    setCarregandoPropostas(true);
    try {
      const filtros: { contatoId?: string; empresaId?: string } = {};

      if (contatoIdSelecionado) {
        filtros.contatoId = contatoIdSelecionado;
      } else if (empresaIdFiltro) {
        filtros.empresaId = empresaIdFiltro;
      }

      const lista = await apiService.listarPropostas(filtros);
      setPropostas(lista || []);
    } catch (error) {
      console.error("Erro ao carregar propostas", error);
    } finally {
      setCarregandoPropostas(false);
    }
  };

  useEffect(() => {
    carregarPropostas();
  }, [contatoIdSelecionado, empresaIdFiltro]);

  const propostasFiltradas = useMemo(() => {
    if (statusFiltro === "todas") return propostas;
    return propostas.filter((p) => p.status === statusFiltro);
  }, [propostas, statusFiltro]);

  const {
    items: propostasPaginadas,
    page: paginaPropostas,
    totalPages: totalPaginasPropostas,
    setPage: setPaginaPropostas,
  } = usePagination(propostasFiltradas, 10);

  const contatoSelecionado = contatosFiltro.find(
    (c) => c.id === contatoIdSelecionado,
  );

  const handleDuplicarProposta = async (propostaId: string) => {
    try {
      await apiService.duplicarProposta(propostaId);
      await carregarPropostas();
      setPropostaSelecionada(null);
    } catch (error) {
      console.error("Erro ao duplicar proposta", error);
    }
  };

  // Filtros da listagem: coleções filtradas por texto
  return (
    <PageContainer>
      <MainContent>
        {!editandoProposta && (
          <>
            <S.PageHeader>
              <div>
                <S.PageTitle>Propostas comerciais</S.PageTitle>
              </div>
              <S.PrimaryButton onClick={() => setCriando((v) => !v)}>
                {criando ? "Fechar nova proposta" : "Nova proposta"}
              </S.PrimaryButton>
            </S.PageHeader>
          </>
        )}

        {!criando && !editandoProposta && (
          <>
            <S.FiltersRow>
              <ComboBox
                options={marcas.map((marca) => ({
                  value: String(marca.id),
                  label: marca.name || "",
                }))}
                value={marcaIdFiltro ? String(marcaIdFiltro) : ""}
                onChange={(valor) =>
                  setMarcaIdFiltro(valor ? Number(valor) : null)
                }
                placeholder="Todas as marcas"
              />

              <ComboBox
                options={empresasFiltro.map((empresa) => ({
                  value: empresa.id,
                  label: empresa.nome || "",
                }))}
                value={empresaIdFiltro}
                onChange={(valor) => {
                  setEmpresaIdFiltro(valor);
                  setContatoIdSelecionado("");
                }}
                placeholder="Todas as empresas"
              />

              <ComboBox
                options={contatosFiltro.map((contato) => ({
                  value: contato.id,
                  label: contato.nome || "",
                }))}
                value={contatoIdSelecionado}
                onChange={(valor) => setContatoIdSelecionado(valor)}
                placeholder={
                  carregandoContatosLista
                    ? "Carregando contatos..."
                    : "Selecione um contato"
                }
                disabled={!empresaIdFiltro}
              />

              <S.Select
                value={statusFiltro}
                onChange={(e) =>
                  setStatusFiltro(e.target.value as StatusProposta | "todas")
                }
                disabled={!contatoIdSelecionado}
              >
                <option value="todas">Todos os status</option>
                <option value="rascunho">Rascunho</option>
                <option value="enviada">Enviada</option>
                <option value="visualizada">Visualizada</option>
                <option value="aprovada">Aprovada</option>
                <option value="recusada">Recusada</option>
                <option value="expirada">Expirada</option>
              </S.Select>
            </S.FiltersRow>

            <S.TableWrapper>
              <S.Table>
                <S.Thead>
                  <tr>
                    {/* <S.Th>Número</S.Th> */}
                    <S.Th>Título</S.Th>
                    <S.Th>Empresa</S.Th>
                    <S.Th>Valor total</S.Th>
                    <S.Th>Status</S.Th>
                    <S.Th>Criada em</S.Th>
                    <S.Th></S.Th>
                  </tr>
                </S.Thead>
                <tbody>
                  {carregandoPropostas ? (
                    <tr>
                      <S.Td colSpan={6}>
                        <S.EmptyState>Carregando propostas...</S.EmptyState>
                      </S.Td>
                    </tr>
                  ) : propostasFiltradas.length === 0 ? (
                    <tr>
                      <S.Td colSpan={6}>
                        <S.EmptyState>
                          Nenhuma proposta encontrada.
                        </S.EmptyState>
                      </S.Td>
                    </tr>
                  ) : (
                    propostasPaginadas.map((proposta) => (
                      <S.Tr key={proposta.id}>
                        {/* <S.Td>{proposta.numero}</S.Td> */}
                        <S.Td>{proposta.titulo}</S.Td>
                        <S.Td>{proposta.empresa?.nome || "-"}</S.Td>
                        <S.Td>
                          {proposta.valorTotal.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: proposta.moeda || "BRL",
                          })}
                        </S.Td>
                        <S.Td>
                          <S.StatusBadge $status={proposta.status}>
                            {STATUS_LABELS[proposta.status]}
                          </S.StatusBadge>
                        </S.Td>
                        <S.Td>
                          {new Date(proposta.criadoEm).toLocaleDateString(
                            "pt-BR",
                          )}
                        </S.Td>
                        <S.Td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <S.PrimaryButton
                              type="button"
                              onClick={() => setPropostaSelecionada(proposta)}
                            >
                              Gerenciar
                            </S.PrimaryButton>
                            <S.SecondaryButton
                              type="button"
                              onClick={() => {
                                router.push(
                                  `/propostas/${proposta.id}/visualizar`,
                                );
                              }}
                            >
                              Ver proposta
                            </S.SecondaryButton>
                          </div>
                        </S.Td>
                      </S.Tr>
                    ))
                  )}
                </tbody>
              </S.Table>
            </S.TableWrapper>

            {contatoIdSelecionado && propostasFiltradas.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "0.75rem",
                  fontSize: "0.85rem",
                }}
              >
                <span>
                  Página {paginaPropostas} de {totalPaginasPropostas}
                </span>
                <S.SecondaryButton
                  type="button"
                  onClick={() => setPaginaPropostas(paginaPropostas - 1)}
                  disabled={paginaPropostas <= 1}
                >
                  Anterior
                </S.SecondaryButton>
                <S.SecondaryButton
                  type="button"
                  onClick={() => setPaginaPropostas(paginaPropostas + 1)}
                  disabled={paginaPropostas >= totalPaginasPropostas}
                >
                  Próxima
                </S.SecondaryButton>
              </div>
            )}

            {contatoSelecionado && (
              <div style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
                Exibindo propostas para:{" "}
                <strong>{contatoSelecionado.nome}</strong>
                {contatoSelecionado.empresa?.nome && (
                  <> ({contatoSelecionado.empresa.nome})</>
                )}
              </div>
            )}
          </>
        )}

        {criando && !editandoProposta && (
          <NewProposalForm
            initialMarcaId={novaDefaults?.marcaId ?? null}
            initialEmpresaId={novaDefaults?.empresaId ?? ""}
            initialContatoId={novaDefaults?.contatoId ?? ""}
            retornarParaContatoId={retornarParaContatoId}
            openIA={openIA}
            onClose={() => {
              setCriando(false);
              setOpenIA(false);
            }}
            onCreated={({ contatoId }) => {
              setContatoIdSelecionado(contatoId);
              setCriando(false);
              setOpenIA(false);
            }}
          />
        )}

        {!criando && !editandoProposta && propostaSelecionada && (
          <Modal
            isOpen={!!propostaSelecionada}
            onClose={() => setPropostaSelecionada(null)}
            title={`Proposta ${propostaSelecionada.numero}`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div>
                <strong>Título:</strong> {propostaSelecionada.titulo}
              </div>
              <div>
                <strong>Empresa:</strong>{" "}
                {propostaSelecionada.empresa?.nome || "-"}
              </div>
              <div>
                <strong>Contato:</strong>{" "}
                {propostaSelecionada.contato?.nome || "-"}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <S.StatusBadge $status={propostaSelecionada.status}>
                  {STATUS_LABELS[propostaSelecionada.status]}
                </S.StatusBadge>
              </div>
              <div>
                <strong>Valor total:</strong>{" "}
                {propostaSelecionada.valorTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: propostaSelecionada.moeda || "BRL",
                })}
              </div>
              <div>
                <strong>Criada em:</strong>{" "}
                {new Date(propostaSelecionada.criadoEm).toLocaleDateString(
                  "pt-BR",
                )}
              </div>

              <div
                style={{
                  marginTop: "0.5rem",
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <S.PrimaryButton
                  type="button"
                  onClick={() => {
                    setEditandoProposta(propostaSelecionada.id);
                    setPropostaSelecionada(null);
                  }}
                >
                  Editar proposta
                </S.PrimaryButton>
                <S.SecondaryButton
                  type="button"
                  onClick={() => handleDuplicarProposta(propostaSelecionada.id)}
                >
                  Duplicar proposta
                </S.SecondaryButton>
                <S.SecondaryButton
                  type="button"
                  onClick={() => {
                    router.push(
                      `/propostas/${propostaSelecionada.id}/visualizar`,
                    );
                    setPropostaSelecionada(null);
                  }}
                >
                  Abrir página da proposta
                </S.SecondaryButton>
              </div>
            </div>
          </Modal>
        )}

        {editandoProposta && (
          <EditProposalForm
            propostaId={editandoProposta}
            onClose={() => setEditandoProposta(null)}
            onUpdated={() => {
              carregarPropostas();
              setEditandoProposta(null);
            }}
          />
        )}
      </MainContent>
    </PageContainer>
  );
}
