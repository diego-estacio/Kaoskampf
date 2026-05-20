"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiService } from "../../src/services/api";
import {
  CatalogoItem,
  Contato,
  Empresa,
  Marca,
  MoedaProposta,
  PricingTier,
  Proposta,
  PropostaItemInput,
  TipoDescontoItem,
} from "../../src/types";
import { NovaPropostaForm } from "./NovaPropostaForm";
import { NovoItemForm } from "./NewProposalForm";

interface EditProposalFormProps {
  propostaId: string;
  onClose: () => void;
  onUpdated?: () => void;
}

export function EditProposalForm({
  propostaId,
  onClose,
  onUpdated,
}: EditProposalFormProps) {
  const [carregando, setCarregando] = useState(true);
  const [proposta, setProposta] = useState<Proposta | null>(null);

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcaIdNova, setMarcaIdNova] = useState<number | null>(null);

  const [empresasMarca, setEmpresasMarca] = useState<Empresa[]>([]);
  const [empresaIdNova, setEmpresaIdNova] = useState<string>("");

  const [contatosEmpresa, setContatosEmpresa] = useState<Contato[]>([]);
  const [contatoIdNova, setContatoIdNova] = useState<string>("");

  const [catalogoItensMarca, setCatalogoItensMarca] = useState<CatalogoItem[]>(
    [],
  );
  const [carregandoCatalogo, setCarregandoCatalogo] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("");
  const [catalogoIdSelecionado, setCatalogoIdSelecionado] =
    useState<string>("");

  const [tituloNova, setTituloNova] = useState("");
  const [introducaoNova, setIntroducaoNova] = useState("");
  const [moedaNova, setMoedaNova] = useState<MoedaProposta>("BRL");
  const [itensNova, setItensNova] = useState<NovoItemForm[]>([]);
  const [salvandoNova, setSalvandoNova] = useState(false);

  // Estados de desconto global
  const [tipoDescontoGlobal, setTipoDescontoGlobal] = useState<
    "" | "valor" | "percentual"
  >("");
  const [valorDescontoGlobal, setValorDescontoGlobal] = useState("");

  // Estados de validação
  const [erros, setErros] = useState({
    marca: false,
    contato: false,
    titulo: false,
    itens: false,
  });

  // Refs para scroll
  const marcaRef = useRef<HTMLDivElement>(null);
  const contatoRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLDivElement>(null);
  const itensRef = useRef<HTMLDivElement>(null);

  const scrollToItem = (id: string) => {
    if (typeof window === "undefined") return;
    const el = document.querySelector<HTMLElement>(
      `[data-proposta-item-id="${id}"]`,
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Carregar proposta
  useEffect(() => {
    const carregarProposta = async () => {
      setCarregando(true);
      try {
        const data = await apiService.buscarProposta(propostaId);
        setProposta(data);

        // Preencher formulário com dados da proposta
        setTituloNova(data.titulo);
        setIntroducaoNova(data.introducao || "");
        setMoedaNova(data.moeda);
        setMarcaIdNova(data.marcaId || null);
        setEmpresaIdNova(data.empresaId);
        setContatoIdNova(data.contatoId);
        setTipoDescontoGlobal(data.tipoDescontoGlobal || "");
        setValorDescontoGlobal(
          data.valorDescontoGlobal ? String(data.valorDescontoGlobal) : "",
        );

        // Converter itens da proposta para o formato do formulário
        if (data.itens && data.itens.length > 0) {
          const itensConvertidos: NovoItemForm[] = data.itens.map((item) => ({
            id: item.id,
            itemCatalogoId: item.itemCatalogoId || null,
            nome: item.nome,
            descricao: item.descricao || "",
            inclui: item.inclui || "",
            naoInclui: item.naoInclui || "",
            quantidade: String(item.quantidade),
            precoUnitario: String(item.precoUnitario),
            tipoDesconto: item.tipoDesconto || ("" as "" | TipoDescontoItem),
            valorDesconto: item.valorDesconto ? String(item.valorDesconto) : "",
            isLocked: false,
            pricingTier: "" as PricingTier | "",
          }));
          setItensNova(itensConvertidos);
        }
      } catch (error) {
        console.error("Erro ao carregar proposta para edição", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarProposta();
  }, [propostaId]);

  // Carregar marcas
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

  // Carregar empresas com base na marca selecionada
  useEffect(() => {
    if (carregando) return;

    const carregarEmpresas = async () => {
      try {
        if (marcaIdNova) {
          const lista = await apiService.buscarEmpresasPorMarca(
            String(marcaIdNova),
          );
          setEmpresasMarca(lista || []);
        } else {
          const lista = await apiService.buscarEmpresas();
          setEmpresasMarca(lista || []);
        }
      } catch (error) {
        console.error("Erro ao carregar empresas para editar proposta", error);
      }
    };

    carregarEmpresas();
  }, [marcaIdNova, carregando]);

  // Carregar contatos da empresa selecionada
  useEffect(() => {
    if (carregando || !empresaIdNova) {
      if (!carregando) {
        setContatosEmpresa([]);
        setContatoIdNova("");
      }
      return;
    }

    const carregarContatosEmpresa = async () => {
      try {
        const lista = await apiService.filtrarContatos({
          empresaId: empresaIdNova,
        });
        setContatosEmpresa(lista || []);
      } catch (error) {
        console.error("Erro ao carregar contatos da empresa", error);
      }
    };

    carregarContatosEmpresa();
  }, [empresaIdNova, carregando]);

  // Carregar catálogo
  useEffect(() => {
    if (carregando) return;

    const carregarCatalogo = async () => {
      setCarregandoCatalogo(true);
      try {
        let itens: CatalogoItem[] = [];
        if (marcaIdNova) {
          itens = await apiService.listarCatalogoItens(marcaIdNova);
        }
        // Se não achou itens pela marca ou sem marca, carrega todos
        if (!itens.length) {
          itens = await apiService.listarCatalogoItensTodos();
        }
        setCatalogoItensMarca(itens || []);
        setTipoSelecionado("");
        setCatalogoIdSelecionado("");
      } catch (error) {
        console.error("Erro ao carregar catálogo", error);
      } finally {
        setCarregandoCatalogo(false);
      }
    };

    carregarCatalogo();
  }, [marcaIdNova, carregando]);

  const marcasFiltradas = useMemo(() => marcas, [marcas]);
  const empresasFiltradas = useMemo(() => empresasMarca, [empresasMarca]);
  const contatosFiltrados = useMemo(() => contatosEmpresa, [contatosEmpresa]);

  const tiposCatalogo = useMemo(() => {
    const tipos = [...new Set(catalogoItensMarca.map((i) => i.tipo))].sort();
    return tipos;
  }, [catalogoItensMarca]);

  const catalogoItensFiltrados = useMemo(() => {
    if (!tipoSelecionado) return [];
    return catalogoItensMarca.filter((i) => i.tipo === tipoSelecionado);
  }, [catalogoItensMarca, tipoSelecionado]);

  const handleChangeTipo = (valor: string) => {
    setTipoSelecionado(valor);
    setCatalogoIdSelecionado("");
  };

  const handleAdicionarItemDoCatalogo = () => {
    if (!catalogoIdSelecionado) return;
    const catalogo = catalogoItensMarca.find(
      (i) => i.id === catalogoIdSelecionado,
    );
    if (!catalogo) return;

    const novoId = `${Date.now()}-${Math.random()}`;
    const novo: NovoItemForm = {
      id: novoId,
      itemCatalogoId: catalogo.id,
      nome: `${catalogo.tipo} - ${catalogo.especificacoes}`,
      descricao: (catalogo.descricao || "").trim(),
      inclui: (catalogo.inclui || "").trim(),
      naoInclui: (catalogo.naoInclui || "").trim(),
      quantidade: "1",
      precoUnitario: String(catalogo.precoG),
      tipoDesconto: "",
      valorDesconto: "",
      isLocked: false,
      pricingTier: "G",
    };
    setItensNova((atual) => [...atual, novo]);
    setErros((prev) => ({ ...prev, itens: false }));
    setTimeout(() => scrollToItem(novoId), 0);
    setCatalogoIdSelecionado("");
  };

  const handleAdicionarItemManual = () => {
    const novoId = `${Date.now()}-${Math.random()}`;
    const novo: NovoItemForm = {
      id: novoId,
      itemCatalogoId: null,
      nome: "",
      descricao: "",
      inclui: "",
      naoInclui: "",
      quantidade: "1",
      precoUnitario: "0",
      tipoDesconto: "",
      valorDesconto: "",
      isLocked: false,
      pricingTier: "",
    };
    setItensNova((atual) => [...atual, novo]);
    setTimeout(() => scrollToItem(novoId), 0);
  };

  const handleAlterarItem = (
    id: string,
    campo: keyof NovoItemForm,
    valor: string,
  ) => {
    setItensNova((atual) =>
      atual.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [campo]: valor };

        // When tier changes on a catalog item, auto-update price
        if (campo === "pricingTier" && item.itemCatalogoId) {
          const catalogo = catalogoItensMarca.find(
            (c) => c.id === item.itemCatalogoId,
          );
          if (catalogo) {
            if (valor === "M" && catalogo.precoM != null) {
              updated.precoUnitario = String(catalogo.precoM);
            } else if (valor === "P" && catalogo.precoP != null) {
              updated.precoUnitario = String(catalogo.precoP);
            } else {
              updated.precoUnitario = String(catalogo.precoG);
            }
          }
        }

        return updated;
      }),
    );
  };

  const handleRemoverItem = (id: string) => {
    setItensNova((atual) => atual.filter((item) => item.id !== id));
  };

  const handleToggleItemLock = (id: string, locked: boolean) => {
    setItensNova((atual) =>
      atual.map((item) =>
        item.id === id ? { ...item, isLocked: locked } : item,
      ),
    );
  };

  const handleAtualizarProposta = async () => {
    // Validação com feedback visual
    const novosErros = {
      marca: !marcaIdNova,
      contato: !contatoIdNova,
      titulo: !tituloNova.trim(),
      itens: itensNova.length === 0,
    };

    setErros(novosErros);

    // Se houver erros, fazer scroll para o primeiro campo com erro
    if (
      novosErros.marca ||
      novosErros.contato ||
      novosErros.titulo ||
      novosErros.itens
    ) {
      if (novosErros.marca && marcaRef.current) {
        marcaRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (novosErros.contato && contatoRef.current) {
        contatoRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (novosErros.titulo && tituloRef.current) {
        tituloRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (novosErros.itens && itensRef.current) {
        itensRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    const itensPayload: PropostaItemInput[] = itensNova.map((item) => {
      const quantidade = parseFloat(item.quantidade.replace(",", ".")) || 1;
      const precoUnitario =
        parseFloat(item.precoUnitario.replace(",", ".")) || 0;
      const valorDesconto = item.valorDesconto
        ? parseFloat(item.valorDesconto.replace(",", "."))
        : undefined;

      return {
        itemCatalogoId: item.itemCatalogoId || undefined,
        nome: item.nome || undefined,
        descricao: item.descricao || undefined,
        inclui: item.inclui || undefined,
        naoInclui: item.naoInclui || undefined,
        quantidade,
        precoUnitario,
        tipoDesconto: item.tipoDesconto || undefined,
        valorDesconto,
        pricingTier: item.pricingTier || undefined,
      };
    });

    setSalvandoNova(true);
    try {
      const valorDescontoGlobalNum = valorDescontoGlobal
        ? parseFloat(valorDescontoGlobal.replace(",", "."))
        : undefined;

      await apiService.atualizarProposta(propostaId, {
        titulo: tituloNova.trim(),
        introducao: introducaoNova.trim() || undefined,
        moeda: moedaNova,
        tipoDescontoGlobal: tipoDescontoGlobal || undefined,
        valorDescontoGlobal: valorDescontoGlobalNum,
        itens: itensPayload,
      });

      if (onUpdated) {
        onUpdated();
      }

      onClose();
    } catch (error) {
      console.error("Erro ao atualizar proposta", error);
    } finally {
      setSalvandoNova(false);
    }
  };

  if (carregando) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Carregando proposta...
      </div>
    );
  }

  return (
    <NovaPropostaForm
      isEditMode={true}
      editModeTitle={`Editar proposta ${proposta?.numero || ""}`}
      marcas={marcasFiltradas}
      empresas={empresasFiltradas}
      contatos={contatosFiltrados}
      marcaIdNova={marcaIdNova}
      onChangeMarca={(valor) => {
        setMarcaIdNova(valor);
        setErros((prev) => ({ ...prev, marca: false }));
      }}
      empresaIdNova={empresaIdNova}
      onChangeEmpresa={setEmpresaIdNova}
      contatoIdNova={contatoIdNova}
      onChangeContato={(valor) => {
        setContatoIdNova(valor);
        setErros((prev) => ({ ...prev, contato: false }));
      }}
      tituloNova={tituloNova}
      onChangeTitulo={(valor) => {
        setTituloNova(valor);
        setErros((prev) => ({ ...prev, titulo: false }));
      }}
      introducaoNova={introducaoNova}
      onChangeIntroducao={setIntroducaoNova}
      moedaNova={moedaNova}
      onChangeMoeda={setMoedaNova}
      itensNova={itensNova}
      onAlterarItem={handleAlterarItem}
      onRemoverItem={handleRemoverItem}
      onToggleItemLock={handleToggleItemLock}
      onAdicionarItemDoCatalogo={handleAdicionarItemDoCatalogo}
      onAdicionarItemManual={() => {
        handleAdicionarItemManual();
        setErros((prev) => ({ ...prev, itens: false }));
      }}
      tiposCatalogo={tiposCatalogo}
      tipoSelecionado={tipoSelecionado}
      onChangeTipo={handleChangeTipo}
      catalogoIdSelecionado={catalogoIdSelecionado}
      onChangeCatalogoId={setCatalogoIdSelecionado}
      carregandoCatalogo={carregandoCatalogo}
      catalogoItensMarca={catalogoItensFiltrados}
      salvandoNova={salvandoNova}
      onCriarProposta={handleAtualizarProposta}
      onFechar={onClose}
      onCancelar={onClose}
      tipoDescontoGlobal={tipoDescontoGlobal}
      onChangeTipoDescontoGlobal={setTipoDescontoGlobal}
      valorDescontoGlobal={valorDescontoGlobal}
      onChangeValorDescontoGlobal={setValorDescontoGlobal}
      erros={erros}
      marcaRef={marcaRef}
      contatoRef={contatoRef}
      tituloRef={tituloRef}
      itensRef={itensRef}
    />
  );
}
