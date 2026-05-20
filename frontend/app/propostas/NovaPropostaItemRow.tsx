import React from "react";
import type { NovoItemForm } from "./NovaPropostaForm";
import { MoedaProposta, PricingTier, TipoDescontoItem } from "../../src/types";
import * as S from "./styles";

export interface NovaPropostaItemRowProps {
  item: NovoItemForm;
  moedaNova: MoedaProposta;
  onAlterarItem: (id: string, campo: keyof NovoItemForm, valor: string) => void;
  onRemoverItem: (id: string) => void;
  onToggleItemLock: (id: string, locked: boolean) => void;
}

export function NovaPropostaItemRow({
  item,
  moedaNova,
  onAlterarItem,
  onRemoverItem,
  onToggleItemLock,
}: NovaPropostaItemRowProps) {
  const isLocked = item.isLocked ?? false;
  const quantidade = parseFloat(item.quantidade.replace(",", ".")) || 1;
  const precoUnitario = parseFloat(item.precoUnitario.replace(",", ".")) || 0;
  let total = quantidade * precoUnitario;
  if (item.tipoDesconto && item.valorDesconto) {
    const v = parseFloat(item.valorDesconto.replace(",", ".")) || 0;
    if (item.tipoDesconto === "valor") {
      total = total - v;
    } else if (item.tipoDesconto === "percentual") {
      total = total - (total * v) / 100;
    }
    if (total < 0) total = 0;
  }

  return (
    <tr data-proposta-item-id={item.id}>
      <S.ItemsTd colSpan={6}>
        <S.ItemCard>
          <S.FieldRow>
            <S.Field>
              <S.Label>Nome</S.Label>
              <S.SmallInput
                value={item.nome}
                disabled={isLocked}
                onChange={(e) => onAlterarItem(item.id, "nome", e.target.value)}
                placeholder="Nome do serviço"
              />
            </S.Field>
            {item.itemCatalogoId && (
              <S.Field style={{ maxWidth: 160 }}>
                <S.Label>Tier</S.Label>
                <div
                  style={{
                    display: "flex",
                    borderRadius: 6,
                    overflow: "hidden",
                    border: "1px solid #d0d5dd",
                  }}
                >
                  {(["G", "M", "P"] as PricingTier[]).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      disabled={isLocked}
                      onClick={() =>
                        onAlterarItem(item.id, "pricingTier", tier)
                      }
                      style={{
                        flex: 1,
                        padding: "0.35rem 0.65rem",
                        border: "none",
                        cursor: isLocked ? "default" : "pointer",
                        fontWeight: item.pricingTier === tier ? 700 : 400,
                        fontSize: "0.82rem",
                        background:
                          item.pricingTier === tier ? "#1a73e8" : "#fff",
                        color: item.pricingTier === tier ? "#fff" : "#344054",
                        borderRight:
                          tier !== "P" ? "1px solid #d0d5dd" : "none",
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </S.Field>
            )}
            <S.Field style={{ maxWidth: 90 }}>
              <S.Label>Qtd</S.Label>
              <S.SmallInput
                value={item.quantidade}
                disabled={isLocked}
                onChange={(e) =>
                  onAlterarItem(item.id, "quantidade", e.target.value)
                }
              />
            </S.Field>
            <S.Field style={{ maxWidth: 130 }}>
              <S.Label>Preço unit.</S.Label>
              <S.SmallInput
                value={item.precoUnitario}
                disabled={isLocked}
                onChange={(e) =>
                  onAlterarItem(item.id, "precoUnitario", e.target.value)
                }
              />
            </S.Field>
            <S.Field style={{ maxWidth: 170 }}>
              <S.Label>Desconto</S.Label>
              <S.SmallSelect
                value={item.tipoDesconto}
                disabled={isLocked}
                onChange={(e) =>
                  onAlterarItem(
                    item.id,
                    "tipoDesconto",
                    e.target.value as "" | TipoDescontoItem,
                  )
                }
              >
                <option value="">Sem desconto</option>
                <option value="valor">R$</option>
                <option value="percentual">%</option>
              </S.SmallSelect>
              <S.SmallInput
                style={{ marginTop: 4 }}
                value={item.valorDesconto}
                disabled={isLocked}
                onChange={(e) =>
                  onAlterarItem(item.id, "valorDesconto", e.target.value)
                }
                placeholder="Valor"
              />
            </S.Field>
            <S.Field style={{ maxWidth: 150 }}>
              <S.Label>Total aprox.</S.Label>
              <div style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                {total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: moedaNova,
                })}
              </div>
            </S.Field>
            <S.Field style={{ maxWidth: 110, alignSelf: "flex-end" }}>
              <S.Label>&nbsp;</S.Label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  alignItems: "stretch",
                }}
              >
                <S.SecondaryButton
                  type="button"
                  onClick={() => onToggleItemLock(item.id, !isLocked)}
                >
                  {isLocked ? "Editar item" : "Salvar item"}
                </S.SecondaryButton>
                <S.DangerButton
                  type="button"
                  onClick={() => onRemoverItem(item.id)}
                >
                  Excluir
                </S.DangerButton>
              </div>
            </S.Field>
          </S.FieldRow>

          {!isLocked && (
            <>
              <S.FieldRow>
                <S.Field>
                  <S.Label>Descrição do item</S.Label>
                  <S.Textarea
                    value={item.descricao}
                    onChange={(e) =>
                      onAlterarItem(item.id, "descricao", e.target.value)
                    }
                    placeholder="Escopo geral do serviço."
                  />
                </S.Field>
              </S.FieldRow>

              <S.FieldRow>
                <S.Field>
                  <S.Label>Contempla</S.Label>
                  <S.Textarea
                    value={item.inclui}
                    onChange={(e) =>
                      onAlterarItem(item.id, "inclui", e.target.value)
                    }
                    placeholder="Liste claramente o que está incluso."
                  />
                </S.Field>
                <S.Field>
                  <S.Label>Não contempla</S.Label>
                  <S.Textarea
                    value={item.naoInclui}
                    onChange={(e) =>
                      onAlterarItem(item.id, "naoInclui", e.target.value)
                    }
                    placeholder="Liste o que está fora de escopo."
                  />
                </S.Field>
              </S.FieldRow>
            </>
          )}
        </S.ItemCard>
      </S.ItemsTd>
    </tr>
  );
}
