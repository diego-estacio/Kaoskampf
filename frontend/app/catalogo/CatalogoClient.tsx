"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";
import {
  PageContainer,
  MainContent,
} from "../../src/components/common/Layout.styles";
import Modal from "../../src/components/common/Modal";
import { apiService } from "../../src/services/api";
import { CatalogoItem, Marca } from "../../src/types";
import { ComboBox } from "../propostas/ComboBox";
import { usePagination } from "../../src/hooks/usePagination";
import * as S from "./styles";

interface NovoItemForm {
  tipo: string;
  especificacoes: string;
  precoG: string;
  precoM: string;
  precoP: string;
  valorAdicionalG: string;
  valorAdicionalM: string;
  valorAdicionalP: string;
  unidadeAdicional: string;
  descricao: string;
  inclui: string;
  naoInclui: string;
}

const NOVO_ITEM_INICIAL: NovoItemForm = {
  tipo: "",
  especificacoes: "",
  precoG: "0",
  precoM: "",
  precoP: "",
  valorAdicionalG: "",
  valorAdicionalM: "",
  valorAdicionalP: "",
  unidadeAdicional: "",
  descricao: "",
  inclui: "",
  naoInclui: "",
};

interface EditarItemForm {
  marcaIds: number[];
  tipo: string;
  especificacoes: string;
  precoG: string;
  precoM: string;
  precoP: string;
  valorAdicionalG: string;
  valorAdicionalM: string;
  valorAdicionalP: string;
  unidadeAdicional: string;
  descricao: string;
  inclui: string;
  naoInclui: string;
}

export function CatalogoClient() {
  const searchParams = useSearchParams();
  const marcaIdFromUrl = searchParams.get("marcaId");
  const marcaNomeFromUrl = searchParams.get("marcaNome");

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcaIdSelecionada, setMarcaIdSelecionada] = useState<number | null>(
    () => (marcaIdFromUrl ? Number(marcaIdFromUrl) : null),
  );
  const [itens, setItens] = useState<CatalogoItem[]>([]);
  const [tipos, setTipos] = useState<string[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [busca, setBusca] = useState<string>("");
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [novoItem, setNovoItem] = useState<NovoItemForm>(NOVO_ITEM_INICIAL);
  const [criandoNovo, setCriandoNovo] = useState(false);
  const [marcasSelecionadasCriacao, setMarcasSelecionadasCriacao] = useState<
    number[]
  >([]);
  const [itensAbertos, setItensAbertos] = useState<Record<string, boolean>>({});
  const [itemEmEdicao, setItemEmEdicao] = useState<CatalogoItem | null>(null);
  const [formEdicao, setFormEdicao] = useState<EditarItemForm | null>(null);

  const marcaSelecionada = useMemo(
    () => marcas.find((m) => m.id === (marcaIdSelecionada ?? -1)) || null,
    [marcas, marcaIdSelecionada],
  );

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

  useEffect(() => {
    const carregarCatalogo = async () => {
      setCarregando(true);
      try {
        const [itensResp, tiposResp] = await Promise.all([
          marcaIdSelecionada
            ? apiService.listarCatalogoItens(marcaIdSelecionada)
            : apiService.listarCatalogoItensTodos(),
          marcaIdSelecionada
            ? apiService.listarCatalogoTipos(marcaIdSelecionada)
            : apiService.listarCatalogoTiposTodos(),
        ]);
        setItens(itensResp || []);
        setTipos(tiposResp || []);
      } catch (error) {
        console.error("Erro ao carregar catálogo", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarCatalogo();
  }, [marcaIdSelecionada]);

  const itensFiltrados = useMemo(() => {
    return itens.filter((item) => {
      if (filtroTipo && item.tipo !== filtroTipo) return false;
      if (!busca) return true;
      const termo = busca.toLowerCase();
      return (
        item.tipo.toLowerCase().includes(termo) ||
        item.especificacoes.toLowerCase().includes(termo) ||
        (item.descricao || "").toLowerCase().includes(termo)
      );
    });
  }, [itens, filtroTipo, busca]);

  const {
    items: itensPaginados,
    page,
    totalPages,
    setPage,
    totalItems,
  } = usePagination(itensFiltrados, 10);

  const handleChangeNovoItem = (campo: keyof NovoItemForm, valor: string) => {
    setNovoItem((atual) => ({ ...atual, [campo]: valor }));
  };

  const abrirCriacao = () => {
    const defaultMarcaId = marcaIdSelecionada ?? (marcas[0] ? marcas[0].id : 1);
    setNovoItem(NOVO_ITEM_INICIAL);
    setMarcasSelecionadasCriacao(defaultMarcaId ? [defaultMarcaId] : []);
    setCriandoNovo(true);
  };

  const fecharCriacao = () => {
    setCriandoNovo(false);
    setNovoItem(NOVO_ITEM_INICIAL);
    setMarcasSelecionadasCriacao([]);
  };

  const toggleMarcaSelecionadaCriacao = (marcaId: number) => {
    setMarcasSelecionadasCriacao((atual) =>
      atual.includes(marcaId)
        ? atual.filter((id) => id !== marcaId)
        : [...atual, marcaId],
    );
  };

  const handleSalvarCriacao = async () => {
    if (!novoItem.tipo.trim() || !novoItem.especificacoes.trim()) return;

    const precoNumber = parseFloat(novoItem.precoG.replace(",", "."));
    if (Number.isNaN(precoNumber) || precoNumber <= 0) return;

    const marcaIdsBase =
      marcasSelecionadasCriacao.length > 0
        ? marcasSelecionadasCriacao
        : marcaIdSelecionada
          ? [marcaIdSelecionada]
          : marcas[0]
            ? [marcas[0].id]
            : [1];

    setSalvando(true);
    try {
      await apiService.criarCatalogoItem({
        marcaIds: marcaIdsBase,
        tipo: novoItem.tipo.trim(),
        especificacoes: novoItem.especificacoes.trim(),
        precoG: precoNumber,
        precoM: novoItem.precoM
          ? parseFloat(novoItem.precoM.replace(",", ".")) || undefined
          : undefined,
        precoP: novoItem.precoP
          ? parseFloat(novoItem.precoP.replace(",", ".")) || undefined
          : undefined,
        valorAdicionalG: novoItem.valorAdicionalG
          ? parseFloat(novoItem.valorAdicionalG.replace(",", ".")) || undefined
          : undefined,
        valorAdicionalM: novoItem.valorAdicionalM
          ? parseFloat(novoItem.valorAdicionalM.replace(",", ".")) || undefined
          : undefined,
        valorAdicionalP: novoItem.valorAdicionalP
          ? parseFloat(novoItem.valorAdicionalP.replace(",", ".")) || undefined
          : undefined,
        unidadeAdicional: novoItem.unidadeAdicional.trim() || undefined,
        descricao: novoItem.descricao.trim() || undefined,
        inclui: novoItem.inclui.trim() || undefined,
        naoInclui: novoItem.naoInclui.trim() || undefined,
        ativo: true,
      });

      const marcaParaRecarregar = marcaIdSelecionada ?? marcaIdsBase[0];
      if (marcaParaRecarregar) {
        const [itensResp, tiposResp] = await Promise.all([
          apiService.listarCatalogoItens(marcaParaRecarregar),
          apiService.listarCatalogoTipos(marcaParaRecarregar),
        ]);
        setMarcaIdSelecionada(marcaParaRecarregar);
        setItens(itensResp || []);
        setTipos(tiposResp || []);
      }

      fecharCriacao();
    } catch (error) {
      console.error("Erro ao salvar item de catálogo", error);
    } finally {
      setSalvando(false);
    }
  };

  const toggleItemAberto = (id: string) => {
    setItensAbertos((atual) => ({ ...atual, [id]: !atual[id] }));
  };

  const abrirEdicao = (item: CatalogoItem) => {
    const marcaIdsBase =
      item.marcas && item.marcas.length
        ? item.marcas.map((m) => m.id)
        : marcaIdSelecionada
          ? [marcaIdSelecionada]
          : [];
    setItemEmEdicao(item);
    setFormEdicao({
      marcaIds: marcaIdsBase,
      tipo: item.tipo,
      especificacoes: item.especificacoes,
      precoG: String(item.precoG),
      precoM: item.precoM != null ? String(item.precoM) : "",
      precoP: item.precoP != null ? String(item.precoP) : "",
      valorAdicionalG:
        item.valorAdicionalG != null ? String(item.valorAdicionalG) : "",
      valorAdicionalM:
        item.valorAdicionalM != null ? String(item.valorAdicionalM) : "",
      valorAdicionalP:
        item.valorAdicionalP != null ? String(item.valorAdicionalP) : "",
      unidadeAdicional: item.unidadeAdicional || "",
      descricao: item.descricao || "",
      inclui: item.inclui || "",
      naoInclui: item.naoInclui || "",
    });
  };

  const fecharEdicao = () => {
    setItemEmEdicao(null);
    setFormEdicao(null);
  };

  const handleChangeEdicao = (
    campo: keyof EditarItemForm,
    valor: string | number,
  ) => {
    setFormEdicao((atual) => (atual ? { ...atual, [campo]: valor } : atual));
  };

  const toggleMarcaEdicao = (marcaId: number) => {
    setFormEdicao((atual) =>
      atual
        ? {
            ...atual,
            marcaIds: atual.marcaIds.includes(marcaId)
              ? atual.marcaIds.filter((id) => id !== marcaId)
              : [...atual.marcaIds, marcaId],
          }
        : atual,
    );
  };

  const handleSalvarEdicao = async () => {
    if (!itemEmEdicao || !formEdicao) return;

    const precoNumber = parseFloat(String(formEdicao.precoG).replace(",", "."));
    if (Number.isNaN(precoNumber) || precoNumber <= 0) return;

    try {
      await apiService.atualizarCatalogoItem(itemEmEdicao.id, {
        marcaIds: formEdicao.marcaIds,
        tipo: formEdicao.tipo.trim(),
        especificacoes: formEdicao.especificacoes.trim(),
        precoG: precoNumber,
        precoM: formEdicao.precoM
          ? parseFloat(String(formEdicao.precoM).replace(",", ".")) || undefined
          : undefined,
        precoP: formEdicao.precoP
          ? parseFloat(String(formEdicao.precoP).replace(",", ".")) || undefined
          : undefined,
        valorAdicionalG: formEdicao.valorAdicionalG
          ? parseFloat(String(formEdicao.valorAdicionalG).replace(",", ".")) ||
            undefined
          : undefined,
        valorAdicionalM: formEdicao.valorAdicionalM
          ? parseFloat(String(formEdicao.valorAdicionalM).replace(",", ".")) ||
            undefined
          : undefined,
        valorAdicionalP: formEdicao.valorAdicionalP
          ? parseFloat(String(formEdicao.valorAdicionalP).replace(",", ".")) ||
            undefined
          : undefined,
        unidadeAdicional: formEdicao.unidadeAdicional.trim() || undefined,
        descricao: formEdicao.descricao.trim() || undefined,
        inclui: formEdicao.inclui.trim() || undefined,
        naoInclui: formEdicao.naoInclui.trim() || undefined,
      });

      const marcaParaRecarregar =
        marcaIdSelecionada ?? formEdicao.marcaIds[0] ?? null;
      if (!marcaParaRecarregar) {
        fecharEdicao();
        return;
      }
      setMarcaIdSelecionada(marcaParaRecarregar);
      const [itensResp, tiposResp] = await Promise.all([
        apiService.listarCatalogoItens(marcaParaRecarregar),
        apiService.listarCatalogoTipos(marcaParaRecarregar),
      ]);
      setItens(itensResp || []);
      setTipos(tiposResp || []);
      fecharEdicao();
    } catch (error) {
      console.error("Erro ao atualizar item de catálogo", error);
    }
  };

  const tituloPagina = marcaIdFromUrl
    ? `Catálogo de serviços - ${
        marcaNomeFromUrl || marcaSelecionada?.name || ""
      }`
    : "Catálogo de serviços";

  return (
    <PageContainer>
      <MainContent>
        <S.PageHeader>
          <S.PageTitle>{tituloPagina}</S.PageTitle>
          <S.PageActions>{/* Espaço para ações futuras */}</S.PageActions>
        </S.PageHeader>

        <S.FiltersRow>
          <div style={{ display: "flex", gap: "0.75rem", flex: 1 }}>
            {marcaIdFromUrl ? (
              <S.SelectedBrandLabel>
                Marca: {marcaNomeFromUrl || marcaSelecionada?.name}
              </S.SelectedBrandLabel>
            ) : (
              <ComboBox
                options={marcas.map((marca) => ({
                  value: String(marca.id),
                  label: marca.name || "",
                }))}
                value={marcaIdSelecionada ? String(marcaIdSelecionada) : ""}
                onChange={(valor) =>
                  setMarcaIdSelecionada(valor ? Number(valor) : null)
                }
                placeholder="Selecione uma marca"
              />
            )}

            <ComboBox
              options={tipos.map((tipo) => ({
                value: tipo,
                label: tipo,
              }))}
              value={filtroTipo}
              onChange={(valor) => setFiltroTipo(valor)}
              placeholder="Todos os tipos"
            />

            <S.SearchInput
              placeholder="Buscar por tipo, especificações ou descrição"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <S.PrimaryButton type="button" onClick={abrirCriacao}>
            + Adicionar serviço
          </S.PrimaryButton>
        </S.FiltersRow>

        <S.TableWrapper>
          <S.Table>
            <S.Thead>
              <tr>
                <S.Th>Nome</S.Th>
                <S.Th>Descrição</S.Th>
                <S.Th>Preço G</S.Th>
                <S.Th>Preço M</S.Th>
                <S.Th>Preço P</S.Th>
                <S.Th></S.Th>
              </tr>
            </S.Thead>
            <tbody>
              {carregando ? (
                <tr>
                  <S.Td colSpan={6}>
                    <S.EmptyState>Carregando itens do catálogo...</S.EmptyState>
                  </S.Td>
                </tr>
              ) : itensFiltrados.length === 0 ? (
                <tr>
                  <S.Td colSpan={6}>
                    <S.EmptyState>Nenhum item encontrado.</S.EmptyState>
                  </S.Td>
                </tr>
              ) : (
                itensPaginados.map((item) => (
                  <React.Fragment key={item.id}>
                    <S.Tr>
                      <S.Td>
                        {item.tipo} - {item.especificacoes}
                      </S.Td>
                      <S.Td>{item.descricao}</S.Td>
                      <S.Td>
                        {item.precoG.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </S.Td>
                      <S.Td>
                        {item.precoM != null
                          ? item.precoM.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "—"}
                      </S.Td>
                      <S.Td>
                        {item.precoP != null
                          ? item.precoP.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "—"}
                      </S.Td>
                      <S.Td>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "0.5rem",
                          }}
                        >
                          <S.DetailsToggleButton
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleItemAberto(item.id);
                            }}
                          >
                            {itensAbertos[item.id]
                              ? "Ocultar detalhes"
                              : "Ver detalhes"}
                          </S.DetailsToggleButton>
                          <S.IconButton
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirEdicao(item);
                            }}
                            aria-label="Editar serviço"
                          >
                            <Pencil size={16} />
                          </S.IconButton>
                        </div>
                      </S.Td>
                    </S.Tr>
                    {itensAbertos[item.id] && (
                      <tr>
                        <S.Td colSpan={6}>
                          <S.DetailsContainer>
                            <S.DetailsColumn>
                              <S.DetailsTitle>Contempla:</S.DetailsTitle>
                              <S.DetailsText>
                                {item.inclui || "(sem informações)"}
                              </S.DetailsText>
                            </S.DetailsColumn>
                            <S.DetailsColumn>
                              <S.DetailsTitle>Não contempla:</S.DetailsTitle>
                              <S.DetailsText>
                                {item.naoInclui || "(sem informações)"}
                              </S.DetailsText>
                            </S.DetailsColumn>
                            {item.unidadeAdicional && (
                              <S.DetailsColumn>
                                <S.DetailsTitle>
                                  Adicional ({item.unidadeAdicional}):
                                </S.DetailsTitle>
                                <S.DetailsText>
                                  G:{" "}
                                  {item.valorAdicionalG != null
                                    ? `R$ ${item.valorAdicionalG}`
                                    : "—"}
                                  {" | "}M:{" "}
                                  {item.valorAdicionalM != null
                                    ? `R$ ${item.valorAdicionalM}`
                                    : "—"}
                                  {" | "}P:{" "}
                                  {item.valorAdicionalP != null
                                    ? `R$ ${item.valorAdicionalP}`
                                    : "—"}
                                </S.DetailsText>
                              </S.DetailsColumn>
                            )}
                          </S.DetailsContainer>
                        </S.Td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </S.Table>
        </S.TableWrapper>

        {totalItems > 0 && (
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
              Página {page} de {totalPages}
            </span>
            <S.SecondaryButton
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Anterior
            </S.SecondaryButton>
            <S.SecondaryButton
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Próxima
            </S.SecondaryButton>
          </div>
        )}

        <Modal
          isOpen={criandoNovo}
          onClose={fecharCriacao}
          title="Adicionar serviço ao catálogo"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  marginBottom: 4,
                }}
              >
                Marcas
              </label>
              <S.MarcasContainer>
                {marcas.length === 0 ? (
                  <S.EmptyMarcas>
                    Nenhuma marca cadastrada no sistema
                  </S.EmptyMarcas>
                ) : (
                  marcas.map((marca) => (
                    <S.MarcaChip
                      key={marca.id}
                      type="button"
                      $selected={marcasSelecionadasCriacao.includes(marca.id)}
                      onClick={() => toggleMarcaSelecionadaCriacao(marca.id)}
                    >
                      {marca.name}
                    </S.MarcaChip>
                  ))
                )}
              </S.MarcasContainer>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Tipo
                </label>
                <S.SmallInput
                  value={novoItem.tipo}
                  onChange={(e) => handleChangeNovoItem("tipo", e.target.value)}
                />
              </div>
              <div style={{ flex: 2 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Especificações
                </label>
                <S.SmallInput
                  value={novoItem.especificacoes}
                  onChange={(e) =>
                    handleChangeNovoItem("especificacoes", e.target.value)
                  }
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Preço G
                </label>
                <S.SmallInput
                  value={novoItem.precoG}
                  onChange={(e) =>
                    handleChangeNovoItem("precoG", e.target.value)
                  }
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Preço M
                </label>
                <S.SmallInput
                  value={novoItem.precoM}
                  onChange={(e) =>
                    handleChangeNovoItem("precoM", e.target.value)
                  }
                  placeholder="Opcional"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Preço P
                </label>
                <S.SmallInput
                  value={novoItem.precoP}
                  onChange={(e) =>
                    handleChangeNovoItem("precoP", e.target.value)
                  }
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Adicional G
                </label>
                <S.SmallInput
                  value={novoItem.valorAdicionalG}
                  onChange={(e) =>
                    handleChangeNovoItem("valorAdicionalG", e.target.value)
                  }
                  placeholder="Opcional"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Adicional M
                </label>
                <S.SmallInput
                  value={novoItem.valorAdicionalM}
                  onChange={(e) =>
                    handleChangeNovoItem("valorAdicionalM", e.target.value)
                  }
                  placeholder="Opcional"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Adicional P
                </label>
                <S.SmallInput
                  value={novoItem.valorAdicionalP}
                  onChange={(e) =>
                    handleChangeNovoItem("valorAdicionalP", e.target.value)
                  }
                  placeholder="Opcional"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Unidade adicional
                </label>
                <S.SmallInput
                  value={novoItem.unidadeAdicional}
                  onChange={(e) =>
                    handleChangeNovoItem("unidadeAdicional", e.target.value)
                  }
                  placeholder="Ex: por hora extra"
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  marginBottom: 4,
                }}
              >
                Descrição
              </label>
              <S.SmallTextarea
                value={novoItem.descricao}
                onChange={(e) =>
                  handleChangeNovoItem("descricao", e.target.value)
                }
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Contempla
                </label>
                <S.SmallTextarea
                  value={novoItem.inclui}
                  onChange={(e) =>
                    handleChangeNovoItem("inclui", e.target.value)
                  }
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Não contempla
                </label>
                <S.SmallTextarea
                  value={novoItem.naoInclui}
                  onChange={(e) =>
                    handleChangeNovoItem("naoInclui", e.target.value)
                  }
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <S.CancelButton
                type="button"
                onClick={fecharCriacao}
                disabled={salvando}
              >
                Cancelar
              </S.CancelButton>
              <S.SaveButton
                type="button"
                onClick={handleSalvarCriacao}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar serviço"}
              </S.SaveButton>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={!!itemEmEdicao && !!formEdicao}
          onClose={fecharEdicao}
          title="Editar serviço de catálogo"
        >
          {formEdicao && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Marcas
                </label>
                <S.MarcasContainer>
                  {marcas.length === 0 ? (
                    <S.EmptyMarcas>
                      Nenhuma marca cadastrada no sistema
                    </S.EmptyMarcas>
                  ) : (
                    marcas.map((marca) => (
                      <S.MarcaChip
                        key={marca.id}
                        type="button"
                        $selected={formEdicao.marcaIds.includes(marca.id)}
                        onClick={() => toggleMarcaEdicao(marca.id)}
                      >
                        {marca.name}
                      </S.MarcaChip>
                    ))
                  )}
                </S.MarcasContainer>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      marginBottom: 4,
                    }}
                  >
                    Tipo
                  </label>
                  <S.SmallInput
                    value={formEdicao.tipo}
                    onChange={(e) => handleChangeEdicao("tipo", e.target.value)}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      marginBottom: 4,
                    }}
                  >
                    Especificações
                  </label>
                  <S.SmallInput
                    value={formEdicao.especificacoes}
                    onChange={(e) =>
                      handleChangeEdicao("especificacoes", e.target.value)
                    }
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      marginBottom: 4,
                    }}
                  >
                    Preço G
                  </label>
                  <S.SmallInput
                    value={formEdicao.precoG}
                    onChange={(e) =>
                      handleChangeEdicao("precoG", e.target.value)
                    }
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      marginBottom: 4,
                    }}
                  >
                    Preço M
                  </label>
                  <S.SmallInput
                    value={formEdicao.precoM}
                    onChange={(e) =>
                      handleChangeEdicao("precoM", e.target.value)
                    }
                    placeholder="Opcional"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      marginBottom: 4,
                    }}
                  >
                    Preço P
                  </label>
                  <S.SmallInput
                    value={formEdicao.precoP}
                    onChange={(e) =>
                      handleChangeEdicao("precoP", e.target.value)
                    }
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      marginBottom: 4,
                    }}
                  >
                    Adicional G
                  </label>
                  <S.SmallInput
                    value={formEdicao.valorAdicionalG}
                    onChange={(e) =>
                      handleChangeEdicao("valorAdicionalG", e.target.value)
                    }
                    placeholder="Opcional"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      marginBottom: 4,
                    }}
                  >
                    Adicional M
                  </label>
                  <S.SmallInput
                    value={formEdicao.valorAdicionalM}
                    onChange={(e) =>
                      handleChangeEdicao("valorAdicionalM", e.target.value)
                    }
                    placeholder="Opcional"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      marginBottom: 4,
                    }}
                  >
                    Adicional P
                  </label>
                  <S.SmallInput
                    value={formEdicao.valorAdicionalP}
                    onChange={(e) =>
                      handleChangeEdicao("valorAdicionalP", e.target.value)
                    }
                    placeholder="Opcional"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      marginBottom: 4,
                    }}
                  >
                    Unidade adicional
                  </label>
                  <S.SmallInput
                    value={formEdicao.unidadeAdicional}
                    onChange={(e) =>
                      handleChangeEdicao("unidadeAdicional", e.target.value)
                    }
                    placeholder="Ex: por hora extra"
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  Descrição
                </label>
                <S.SmallTextarea
                  value={formEdicao.descricao}
                  onChange={(e) =>
                    handleChangeEdicao("descricao", e.target.value)
                  }
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      marginBottom: 4,
                    }}
                  >
                    Contempla
                  </label>
                  <S.SmallTextarea
                    value={formEdicao.inclui}
                    onChange={(e) =>
                      handleChangeEdicao("inclui", e.target.value)
                    }
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      marginBottom: 4,
                    }}
                  >
                    Não contempla
                  </label>
                  <S.SmallTextarea
                    value={formEdicao.naoInclui}
                    onChange={(e) =>
                      handleChangeEdicao("naoInclui", e.target.value)
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <S.CancelButton type="button" onClick={fecharEdicao}>
                  Cancelar
                </S.CancelButton>
                <S.SaveButton type="button" onClick={handleSalvarEdicao}>
                  Salvar alterações
                </S.SaveButton>
              </div>
            </div>
          )}
        </Modal>
      </MainContent>
    </PageContainer>
  );
}
