import React from "react";
import { ComboBox } from "./ComboBox";
import {
  CatalogoItem,
  Contato,
  Empresa,
  Marca,
  MoedaProposta,
} from "../../src/types";
import * as S from "./styles";
import { NovaPropostaItemRow } from "./NovaPropostaItemRow";

export interface NovoItemForm {
  id: string;
  itemCatalogoId?: string | null;
  nome: string;
  descricao: string;
  inclui: string;
  naoInclui: string;
  quantidade: string;
  precoUnitario: string;
  tipoDesconto: "" | import("../../src/types").TipoDescontoItem;
  valorDesconto: string;
  isLocked?: boolean;
  pricingTier: import("../../src/types").PricingTier | "";
}

interface NovaPropostaFormProps {
  marcas: Marca[];
  empresas: Empresa[];
  contatos: Contato[];
  marcaIdNova: number | null;
  onChangeMarca: (value: number | null) => void;
  empresaIdNova: string;
  onChangeEmpresa: (value: string) => void;
  contatoIdNova: string;
  onChangeContato: (value: string) => void;
  tituloNova: string;
  onChangeTitulo: (value: string) => void;
  introducaoNova: string;
  onChangeIntroducao: (value: string) => void;
  moedaNova: MoedaProposta;
  onChangeMoeda: (value: MoedaProposta) => void;
  itensNova: NovoItemForm[];
  onAlterarItem: (id: string, campo: keyof NovoItemForm, valor: string) => void;
  onRemoverItem: (id: string) => void;
  onToggleItemLock: (id: string, locked: boolean) => void;
  onAdicionarItemDoCatalogo: () => void;
  onAdicionarItemManual: () => void;
  tiposCatalogo: string[];
  tipoSelecionado: string;
  onChangeTipo: (value: string) => void;
  catalogoIdSelecionado: string;
  onChangeCatalogoId: (value: string) => void;
  carregandoCatalogo: boolean;
  catalogoItensMarca: CatalogoItem[];
  salvandoNova: boolean;
  onCriarProposta: () => void;
  onFechar: () => void;
  onCancelar: () => void;
  // Desconto global
  tipoDescontoGlobal: "" | "valor" | "percentual";
  onChangeTipoDescontoGlobal: (value: "" | "valor" | "percentual") => void;
  valorDescontoGlobal: string;
  onChangeValorDescontoGlobal: (value: string) => void;
  // Customização para modo de edição
  isEditMode?: boolean;
  editModeTitle?: string;
  // Validação visual
  erros?: {
    marca: boolean;
    contato: boolean;
    titulo: boolean;
    itens: boolean;
  };
  marcaRef?: React.RefObject<HTMLDivElement | null>;
  contatoRef?: React.RefObject<HTMLDivElement | null>;
  tituloRef?: React.RefObject<HTMLDivElement | null>;
  itensRef?: React.RefObject<HTMLDivElement | null>;
}

export function NovaPropostaForm({
  marcas,
  empresas,
  contatos,
  marcaIdNova,
  onChangeMarca,
  empresaIdNova,
  onChangeEmpresa,
  contatoIdNova,
  onChangeContato,
  tituloNova,
  onChangeTitulo,
  introducaoNova,
  onChangeIntroducao,
  moedaNova,
  onChangeMoeda,
  itensNova,
  onAlterarItem,
  onRemoverItem,
  onToggleItemLock,
  onAdicionarItemDoCatalogo,
  onAdicionarItemManual,
  tiposCatalogo,
  tipoSelecionado,
  onChangeTipo,
  catalogoIdSelecionado,
  onChangeCatalogoId,
  carregandoCatalogo,
  catalogoItensMarca,
  salvandoNova,
  onCriarProposta,
  onFechar,
  onCancelar,
  tipoDescontoGlobal,
  onChangeTipoDescontoGlobal,
  valorDescontoGlobal,
  onChangeValorDescontoGlobal,
  isEditMode = false,
  editModeTitle = "Editar proposta",
  erros,
  marcaRef,
  contatoRef,
  tituloRef,
  itensRef,
}: NovaPropostaFormProps) {
  const formTitle = isEditMode ? editModeTitle : "Nova proposta";
  const breadcrumbText = isEditMode ? "Editar proposta" : "Nova proposta";
  const submitButtonText = isEditMode
    ? salvandoNova
      ? "Salvando..."
      : "Salvar alterações"
    : salvandoNova
      ? "Criando..."
      : "Criar proposta";

  // Calcular totais
  const subtotal = itensNova.reduce((acc, item) => {
    const quantidade = parseFloat(item.quantidade.replace(",", ".")) || 0;
    const precoUnit = parseFloat(item.precoUnitario.replace(",", ".")) || 0;
    let totalItem = quantidade * precoUnit;

    // Aplicar desconto do item
    if (item.tipoDesconto && item.valorDesconto) {
      const desconto = parseFloat(item.valorDesconto.replace(",", ".")) || 0;
      if (item.tipoDesconto === "valor") {
        totalItem -= desconto;
      } else if (item.tipoDesconto === "percentual") {
        totalItem -= (totalItem * desconto) / 100;
      }
    }

    return acc + Math.max(0, totalItem);
  }, 0);

  // Aplicar desconto global
  let descontoGlobal = 0;
  if (tipoDescontoGlobal && valorDescontoGlobal) {
    const valorDesc = parseFloat(valorDescontoGlobal.replace(",", ".")) || 0;
    if (tipoDescontoGlobal === "valor") {
      descontoGlobal = valorDesc;
    } else if (tipoDescontoGlobal === "percentual") {
      descontoGlobal = (subtotal * valorDesc) / 100;
    }
  }

  const totalFinal = Math.max(0, subtotal - descontoGlobal);

  return (
    <>
      <S.Breadcrumb>
        <S.BreadcrumbLink type="button" onClick={onFechar}>
          Propostas comerciais
        </S.BreadcrumbLink>
        <S.BreadcrumbSeparator>&gt;</S.BreadcrumbSeparator>
        <span>{breadcrumbText}</span>
      </S.Breadcrumb>

      <S.NewProposalCard>
        <S.SectionTitle>{formTitle}</S.SectionTitle>

        <S.FieldRow>
          <S.Field ref={marcaRef}>
            <S.Label>
              Marca{" "}
              {erros?.marca && <span style={{ color: "#dc2626" }}>*</span>}
            </S.Label>
            <ComboBox
              options={marcas.map((marca) => ({
                value: String(marca.id),
                label: marca.name || "",
              }))}
              value={marcaIdNova ? String(marcaIdNova) : ""}
              onChange={(valor) => onChangeMarca(valor ? Number(valor) : null)}
              placeholder="Selecione uma marca"
              style={erros?.marca ? { border: "2px solid #dc2626" } : undefined}
            />
            {erros?.marca && (
              <S.ErrorMessage>Selecione uma marca</S.ErrorMessage>
            )}
          </S.Field>
          <S.Field>
            <S.Label>Empresa</S.Label>
            <ComboBox
              options={empresas.map((empresa) => ({
                value: empresa.id,
                label: empresa.nome || "",
              }))}
              value={empresaIdNova}
              onChange={(valor) => onChangeEmpresa(valor)}
              placeholder="Selecione uma empresa"
            />
          </S.Field>
          <S.Field ref={contatoRef}>
            <S.Label>
              Contato{" "}
              {erros?.contato && <span style={{ color: "#dc2626" }}>*</span>}
            </S.Label>
            <ComboBox
              options={contatos.map((contato) => ({
                value: contato.id,
                label: contato.nome || "",
              }))}
              value={contatoIdNova}
              onChange={(valor) => onChangeContato(valor)}
              placeholder="Selecione um contato"
              disabled={!empresaIdNova}
              style={
                erros?.contato ? { border: "2px solid #dc2626" } : undefined
              }
            />
            {erros?.contato && (
              <S.ErrorMessage>Selecione um contato</S.ErrorMessage>
            )}
          </S.Field>
        </S.FieldRow>

        <S.FieldRow>
          <S.Field ref={tituloRef}>
            <S.Label>
              Título da proposta{" "}
              {erros?.titulo && <span style={{ color: "#dc2626" }}>*</span>}
            </S.Label>
            <S.Input
              value={tituloNova}
              onChange={(e) => onChangeTitulo(e.target.value)}
              placeholder="Ex.: Proposta de produção de vídeos"
              style={
                erros?.titulo ? { border: "2px solid #dc2626" } : undefined
              }
            />
            {erros?.titulo && (
              <S.ErrorMessage>Digite um título para a proposta</S.ErrorMessage>
            )}
          </S.Field>
          <S.Field style={{ maxWidth: 160 }}>
            <S.Label>Moeda</S.Label>
            <S.SmallSelect
              value={moedaNova}
              onChange={(e) => onChangeMoeda(e.target.value as MoedaProposta)}
            >
              <option value="BRL">BRL</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </S.SmallSelect>
          </S.Field>
        </S.FieldRow>

        <S.FieldRow>
          <S.Field>
            <S.Label>Introdução / observações iniciais</S.Label>
            <S.Textarea
              value={introducaoNova}
              onChange={(e) => onChangeIntroducao(e.target.value)}
              placeholder="Mensagem de abertura para o cliente, contexto da proposta, etc."
            />
          </S.Field>
        </S.FieldRow>

        <S.SectionTitle ref={itensRef}>
          Itens da proposta{" "}
          {erros?.itens && <span style={{ color: "#dc2626" }}>*</span>}
        </S.SectionTitle>
        {erros?.itens && (
          <S.ErrorMessage
            style={{ marginTop: "-0.5rem", marginBottom: "0.5rem" }}
          >
            Adicione pelo menos um item à proposta
          </S.ErrorMessage>
        )}
        <S.SectionSubtitle>
          Adicione itens a partir do catálogo (todas as marcas ou filtrando por
          uma marca específica) ou crie itens manuais.
        </S.SectionSubtitle>

        <S.FieldRow>
          <S.Field>
            <S.Label>Tipo de serviço</S.Label>
            <ComboBox
              options={tiposCatalogo.map((tipo) => ({
                value: tipo,
                label: tipo,
              }))}
              value={tipoSelecionado}
              onChange={(valor) => onChangeTipo(valor)}
              placeholder={
                carregandoCatalogo
                  ? "Carregando catálogo..."
                  : "Selecione o tipo de serviço"
              }
              disabled={carregandoCatalogo}
            />
          </S.Field>
          <S.Field>
            <S.Label>Nome do serviço</S.Label>
            <ComboBox
              options={catalogoItensMarca.map((item) => ({
                value: item.id,
                label: item.especificacoes,
              }))}
              value={catalogoIdSelecionado}
              onChange={(valor) => onChangeCatalogoId(valor)}
              placeholder={
                !tipoSelecionado
                  ? "Selecione primeiro o tipo de serviço"
                  : "Selecione um item do catálogo"
              }
              disabled={carregandoCatalogo || !tipoSelecionado}
            />
          </S.Field>
          <S.Field
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "0.5rem",
              maxWidth: "fit-content",
            }}
          >
            <div
              className="buttons-container"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <S.SecondaryButton
                type="button"
                className="catalog-button"
                onClick={onAdicionarItemDoCatalogo}
                disabled={!catalogoIdSelecionado}
              >
                Adicionar do catálogo
              </S.SecondaryButton>
              <S.SecondaryButton
                className="catalog-button"
                type="button"
                onClick={onAdicionarItemManual}
              >
                Adicionar manualmente
              </S.SecondaryButton>
            </div>
          </S.Field>
        </S.FieldRow>

        {itensNova.length > 0 && (
          <S.ItemsTable>
            <tbody>
              {itensNova.map((item) => (
                <NovaPropostaItemRow
                  key={item.id}
                  item={item}
                  moedaNova={moedaNova}
                  onAlterarItem={onAlterarItem}
                  onRemoverItem={onRemoverItem}
                  onToggleItemLock={onToggleItemLock}
                />
              ))}
            </tbody>
          </S.ItemsTable>
        )}

        {itensNova.length > 0 && (
          <S.TotalCard>
            <S.TotalRow
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "3rem",
              }}
            >
              <S.TotalLabel>Subtotal (soma dos itens)</S.TotalLabel>

              <S.DiscountRow>
                <S.Field
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "0.5rem",
                  }}
                >
                  <S.Label>Desconto sobre o Total</S.Label>
                  <S.DiscountTypeSelect
                    value={tipoDescontoGlobal}
                    onChange={(e) =>
                      onChangeTipoDescontoGlobal(
                        e.target.value as "" | "valor" | "percentual",
                      )
                    }
                  >
                    <option value="">Sem desconto</option>
                    <option value="valor">Desconto em R$</option>
                    <option value="percentual">Desconto em %</option>
                  </S.DiscountTypeSelect>
                </S.Field>

                {tipoDescontoGlobal && (
                  <S.Field style={{ flex: 1 }}>
                    <S.Label>
                      Valor{" "}
                      {tipoDescontoGlobal === "percentual" ? "(%)" : "(R$)"}
                    </S.Label>
                    <S.DiscountInput
                      type="text"
                      value={valorDescontoGlobal}
                      onChange={(e) =>
                        onChangeValorDescontoGlobal(e.target.value)
                      }
                      placeholder={
                        tipoDescontoGlobal === "percentual"
                          ? "Ex: 10"
                          : "Ex: 500"
                      }
                    />
                  </S.Field>
                )}
              </S.DiscountRow>

              <S.TotalValue>
                {Number(subtotal).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </S.TotalValue>
            </S.TotalRow>

            {tipoDescontoGlobal && valorDescontoGlobal && (
              <S.TotalRow>
                <S.TotalLabel>Desconto aplicado</S.TotalLabel>
                <S.TotalValue style={{ color: "#dc2626" }}>
                  -{" "}
                  {Number(descontoGlobal).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </S.TotalValue>
              </S.TotalRow>
            )}

            <S.TotalFinalRow>
              <S.TotalLabel>Total da proposta</S.TotalLabel>
              <S.TotalFinalValue>
                {Number(totalFinal).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </S.TotalFinalValue>
            </S.TotalFinalRow>
          </S.TotalCard>
        )}

        <S.InlineActions>
          <S.PrimaryButton
            type="button"
            onClick={onCriarProposta}
            disabled={
              salvandoNova ||
              !marcaIdNova ||
              !contatoIdNova ||
              itensNova.length === 0
            }
          >
            {submitButtonText}
          </S.PrimaryButton>
          <S.SecondaryButton
            type="button"
            onClick={onCancelar}
            disabled={salvandoNova}
          >
            Cancelar
          </S.SecondaryButton>
        </S.InlineActions>
      </S.NewProposalCard>
    </>
  );
}
