"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "../../src/services/api";
import {
  CatalogoItem,
  Contato,
  Empresa,
  Marca,
  MoedaProposta,
  PricingTier,
  PropostaItemInput,
  TipoDescontoItem,
} from "../../src/types";
import { NovaPropostaForm } from "./NovaPropostaForm";
import IaPropostaModal, { IaSugestao } from "./IaPropostaModal";

export interface NovoItemForm {
  id: string;
  itemCatalogoId?: string | null;
  nome: string;
  descricao: string;
  inclui: string;
  naoInclui: string;
  quantidade: string;
  precoUnitario: string;
  tipoDesconto: "" | TipoDescontoItem;
  valorDesconto: string;
  isLocked?: boolean;
  pricingTier: PricingTier | "";
}

interface NewProposalFormProps {
  initialMarcaId?: number | null;
  initialEmpresaId?: string;
  initialContatoId?: string;
  retornarParaContatoId?: string | null;
  openIA?: boolean;
  onClose: () => void;
  onCreated?: (params: { contatoId: string }) => void;
}

export function NewProposalForm({
  initialMarcaId = null,
  initialEmpresaId = "",
  initialContatoId = "",
  retornarParaContatoId = null,
  openIA = false,
  onClose,
  onCreated,
}: NewProposalFormProps) {
  const router = useRouter();

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcaIdNova, setMarcaIdNova] = useState<number | null>(initialMarcaId);

  const [empresasMarca, setEmpresasMarca] = useState<Empresa[]>([]);
  const [empresaIdNova, setEmpresaIdNova] = useState<string>(initialEmpresaId);

  const [contatosEmpresa, setContatosEmpresa] = useState<Contato[]>([]);
  const [contatoIdNova, setContatoIdNova] = useState<string>(initialContatoId);

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
  const [mostrarIaModal, setMostrarIaModal] = useState(openIA);

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

  // Listen for FAB HubIA click when already on propostas page
  useEffect(() => {
    const handler = () => setMostrarIaModal(true);
    window.addEventListener("open-ia-assistant", handler);
    return () => window.removeEventListener("open-ia-assistant", handler);
  }, []);

  const scrollToItem = (id: string) => {
    if (typeof window === "undefined") return;
    const el = document.querySelector<HTMLElement>(
      `[data-proposta-item-id="${id}"]`,
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
        console.error("Erro ao carregar empresas para nova proposta", error);
      }
    };

    carregarEmpresas();
  }, [marcaIdNova]);

  // Carregar contatos da empresa selecionada
  useEffect(() => {
    if (!empresaIdNova) {
      setContatosEmpresa([]);
      setContatoIdNova("");
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
  }, [empresaIdNova]);

  // Carregar catálogo (sempre carrega todos os itens; filtra por marca se houver associações)
  useEffect(() => {
    const carregarCatalogo = async () => {
      setCarregandoCatalogo(true);
      try {
        let itens: CatalogoItem[] = [];
        if (marcaIdNova) {
          itens = await apiService.listarCatalogoItens(marcaIdNova);
        }
        // Se não achou itens pela marca (sem associações) ou sem marca, carrega todos
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
  }, [marcaIdNova]);

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
    setErros((prev) => ({ ...prev, itens: false }));
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

  const handleAplicarSugestaoIA = (sugestao: IaSugestao) => {
    setTituloNova(sugestao.titulo);
    setIntroducaoNova(sugestao.introducao);

    const novosItens: NovoItemForm[] = sugestao.itens.map((item) => {
      const catalogo = catalogoItensMarca.find(
        (c) => c.id === item.itemCatalogoId,
      );
      let preco = "0";
      if (catalogo) {
        if (item.pricingTier === "M" && catalogo.precoM != null) {
          preco = String(catalogo.precoM);
        } else if (item.pricingTier === "P" && catalogo.precoP != null) {
          preco = String(catalogo.precoP);
        } else {
          preco = String(catalogo.precoG);
        }
      }

      return {
        id: `${Date.now()}-${Math.random()}`,
        itemCatalogoId: catalogo ? item.itemCatalogoId : null,
        nome: item.nome,
        descricao: item.descricao || "",
        inclui: catalogo?.inclui || "",
        naoInclui: catalogo?.naoInclui || "",
        quantidade: String(item.quantidade),
        precoUnitario: preco,
        tipoDesconto: "" as "" | TipoDescontoItem,
        valorDesconto: "",
        isLocked: false,
        pricingTier: item.pricingTier || ("" as PricingTier | ""),
      };
    });

    setItensNova(novosItens);
    setMostrarIaModal(false);
  };

  const handleCriarProposta = async () => {
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

      await apiService.criarProposta({
        contatoId: contatoIdNova,
        marcaId: marcaIdNova,
        titulo: tituloNova.trim(),
        introducao: introducaoNova.trim() || undefined,
        moeda: moedaNova,
        tipoDescontoGlobal: tipoDescontoGlobal || undefined,
        valorDescontoGlobal: valorDescontoGlobalNum,
        itens: itensPayload,
      });

      if (retornarParaContatoId) {
        router.push(`/contatos/${encodeURIComponent(retornarParaContatoId)}`);
        return;
      }

      if (onCreated) {
        onCreated({ contatoId: contatoIdNova });
      }

      setTituloNova("");
      setIntroducaoNova("");
      setMoedaNova("BRL");
      setItensNova([]);
      onClose();
    } catch (error) {
      console.error("Erro ao criar proposta", error);
    } finally {
      setSalvandoNova(false);
    }
  };

  return (
    <>
      <NovaPropostaForm
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
        onAdicionarItemManual={handleAdicionarItemManual}
        tiposCatalogo={tiposCatalogo}
        tipoSelecionado={tipoSelecionado}
        onChangeTipo={handleChangeTipo}
        catalogoIdSelecionado={catalogoIdSelecionado}
        onChangeCatalogoId={setCatalogoIdSelecionado}
        carregandoCatalogo={carregandoCatalogo}
        catalogoItensMarca={catalogoItensFiltrados}
        salvandoNova={salvandoNova}
        onCriarProposta={handleCriarProposta}
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
      {mostrarIaModal && (
        <IaPropostaModal
          marcaId={marcaIdNova}
          onClose={() => setMostrarIaModal(false)}
          onAplicar={handleAplicarSugestaoIA}
        />
      )}
    </>
  );
}
