"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { apiService } from "../../../src/services/api";
import { Proposta, PropostaItem, TipoDesconto } from "../../../src/types";
import * as S from "./styles";
import { PropostaComItens, gerarPdfPropostaSimples } from "./SimpleProposalPdf";
import { MOCK_PROPOSTA } from "./mockproposta";

function formatarData(dataIso: string | undefined) {
  if (!dataIso) return "";
  try {
    return new Date(dataIso).toLocaleDateString("pt-BR");
  } catch {
    return dataIso;
  }
}

export default function PropostaVisualizacao() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [proposta, setProposta] = useState<PropostaComItens | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [usandoMock, setUsandoMock] = useState(false);
  const [itensAbertos, setItensAbertos] = useState<Record<string, boolean>>({});
  const [presentationRevealed, setPresentationRevealed] = useState(false);
  const [responsavelNome, setResponsavelNome] = useState("Equipe Film&Lab");
  const presentationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;

    const carregar = async () => {
      setCarregando(true);
      setErro(null);
      setUsandoMock(false);
      try {
        // Usa método público que não requer autenticação
        const dados = await apiService.buscarPropostaPublica(String(id));
        const itensOrdenados = (dados.itens || []).sort(
          (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0),
        );
        setProposta({ ...(dados as Proposta), itens: itensOrdenados });
      } catch (e) {
        console.error("Erro ao carregar proposta para visualização", e);
        setErro("Não foi possível carregar a proposta, exibindo um exemplo.");
        setProposta(MOCK_PROPOSTA);
        setUsandoMock(true);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [id]);

  // Garante que usamos o nome do responsável quando só temos o ID
  useEffect(() => {
    if (!proposta) return;

    // Se o backend já mandou o objeto usuário, usa direto
    if (proposta.usuarioCriador?.nome) {
      setResponsavelNome(proposta.usuarioCriador.nome);
      return;
    }

    // Para visualização pública, usamos nome padrão se não vier na proposta
    // (não fazemos requisição adicional que exigiria autenticação)
    if (proposta.usuarioCriadorId) {
      // Mantém o nome padrão "Equipe Film&Lab"
      console.log("📝 Usando nome padrão para visualização pública");
    }
  }, [proposta]);

  useEffect(() => {
    const handleScroll = () => {
      if (!presentationRef.current || presentationRevealed) return;
      const rect = presentationRef.current.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const threshold = viewportHeight * 0.45;

      if (rect.top <= threshold) {
        setPresentationRevealed(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [presentationRevealed]);

  const toggleItem = (itemId: string) => {
    setItensAbertos((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleImprimirPdf = () => {
    if (!proposta) return;
    // Expande todos os itens antes de imprimir
    const todosAbertos = Object.fromEntries(
      proposta.itens.map((item) => [String(item.id), true]),
    );
    setItensAbertos(todosAbertos);
    // Aguarda o render do DOM antes de abrir o diálogo de impressão
    setTimeout(() => window.print(), 150);
  };

  if (carregando) {
    return (
      <S.PageWrapper>
        <S.ProposalShell>
          <S.Content>
            <div>Carregando proposta...</div>
          </S.Content>
        </S.ProposalShell>
      </S.PageWrapper>
    );
  }

  if (!proposta) {
    return (
      <S.PageWrapper>
        <S.ProposalShell>
          <S.Content>
            <div>Proposta não encontrada.</div>
          </S.Content>
        </S.ProposalShell>
      </S.PageWrapper>
    );
  }

  const dataCriacao = formatarData(proposta.criadoEm);

  // Parse colorArray: "#0121B2#FF0080#FF9A04#null" → ["#0121B2", "#FF0080", "#FF9A04", null]
  const DEFAULT_LABEL_COLOR = "#5c6d84";
  const labelColors = (() => {
    const raw = proposta.marca?.colorArray;
    if (!raw)
      return [
        DEFAULT_LABEL_COLOR,
        DEFAULT_LABEL_COLOR,
        DEFAULT_LABEL_COLOR,
        DEFAULT_LABEL_COLOR,
      ];
    const parts = raw
      .split("#")
      .filter((_, i) => i > 0)
      .map((s) => {
        const trimmed = s.trim();
        return trimmed && trimmed.toLowerCase() !== "null"
          ? `#${trimmed}`
          : DEFAULT_LABEL_COLOR;
      });
    while (parts.length < 4) parts.push(DEFAULT_LABEL_COLOR);
    return parts;
  })();

  const primaryColor = proposta.marca?.primaryColor || "#9399a3";

  return (
    <>
      <S.PrintStyles />
      <S.PageWrapper>
        <S.WavesBackground>
          <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
            <path
              d="M0,260 Q300,220 600,260 T1200,260 L1200,600 L0,600 Z"
              fill="rgba(251, 113, 133, 0.25)"
            />
            <path
              d="M0,330 Q300,290 600,330 T1200,330 L1200,600 L0,600 Z"
              fill="rgba(249, 115, 22, 0.18)"
            />
          </svg>
        </S.WavesBackground>
        <S.ProposalShell>
          <S.VideoHero>
            <S.VideoFrame
              src="https://player.vimeo.com/video/1003192476?h=5266a5bbde&badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&background=1"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </S.VideoHero>
          <S.ProposalHeader>
            <S.ProposalMeta>
              <S.ProposalTag>PROPOSTA</S.ProposalTag>
              <div>
                Proposta #{proposta.numero} &bull;{" "}
                {proposta.empresa?.nome ?? "Empresa"}
              </div>
            </S.ProposalMeta>
            <S.ProposalTitle>{proposta.titulo}</S.ProposalTitle>
          </S.ProposalHeader>

          <S.Content>
            <S.ContactFieldRow>
              <S.Field>
                <S.ContactLabel style={{ backgroundColor: labelColors[0] }}>
                  Cliente
                </S.ContactLabel>
                <S.TextBlock>{proposta.empresa?.nome ?? "Empresa"}</S.TextBlock>
              </S.Field>
              <S.Field>
                <S.ContactLabel style={{ backgroundColor: labelColors[1] }}>
                  Contato
                </S.ContactLabel>
                <S.TextBlock>{proposta.contato?.nome ?? "Contato"}</S.TextBlock>
              </S.Field>
              <S.Field>
                <S.ContactLabel style={{ backgroundColor: labelColors[2] }}>
                  Responsável
                </S.ContactLabel>
                <S.TextBlock>{responsavelNome}</S.TextBlock>
              </S.Field>
              <S.Field>
                <S.ContactLabel style={{ backgroundColor: labelColors[3] }}>
                  Data
                </S.ContactLabel>
                <S.TextBlock>{dataCriacao}</S.TextBlock>
              </S.Field>
            </S.ContactFieldRow>
          </S.Content>
          <S.Presentation
            ref={presentationRef}
            $revealed={presentationRevealed}
          >
            <S.PresentationTitleContainer>
              <S.PresentationTitle>Quem Somos</S.PresentationTitle>
              <S.PresentationSubtitle>
                {proposta.marca?.slug ?? ""}
              </S.PresentationSubtitle>
              <S.PresentationText>
                {(proposta.marca?.description ?? "")
                  .split("#")
                  .map((block, i) => (
                    <p
                      key={i}
                      style={{
                        marginBottom:
                          i <
                          (proposta.marca?.description ?? "").split("#")
                            .length -
                            1
                            ? "0.75rem"
                            : 0,
                      }}
                    >
                      {block.trim()}
                    </p>
                  ))}
              </S.PresentationText>
            </S.PresentationTitleContainer>
            <img src="/test.jpg" alt=""></img>
          </S.Presentation>

          <S.Content>
            {erro && (
              <S.ErrorBanner>
                {erro} {usandoMock && "(dados ilustrativos)"}
              </S.ErrorBanner>
            )}

            <S.SectionTitle>Detalhes da Proposta</S.SectionTitle>
            {proposta.introducao && (
              <S.FieldRow>
                <S.Field>
                  <S.Label>Introdução</S.Label>
                  <S.TextBlock>{proposta.introducao}</S.TextBlock>
                </S.Field>
              </S.FieldRow>
            )}
            <S.ItemsList>
              <S.Label>Descrição dos itens</S.Label>
              {(proposta.itens || []).map((item) => {
                const total = item.precoTotal;
                const aberto = itensAbertos[item.id];

                return (
                  <S.ItemCard key={item.id}>
                    <S.ItemHeader>
                      <S.ItemField
                        style={{
                          flex: "2 1 260px",
                          minWidth: 0,
                          maxWidth: "60%",
                        }}
                      >
                        <S.ItemLabel>Serviço</S.ItemLabel>
                        <S.ItemValue className="item-name">
                          {item.nome}
                        </S.ItemValue>
                      </S.ItemField>
                      <S.ItemContainer>
                        <S.PriceColumn>
                          <S.ItemLabel>Preço</S.ItemLabel>
                          <S.ItemValue>
                            {Number(item.precoUnitario).toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              },
                            )}
                          </S.ItemValue>
                        </S.PriceColumn>
                        <S.PriceColumn>
                          <S.ItemLabel>Qtd</S.ItemLabel>
                          <S.ItemValue>{item.quantidade}</S.ItemValue>
                        </S.PriceColumn>
                        <S.PriceColumn>
                          <S.ItemLabel>Desc.</S.ItemLabel>
                          {item.tipoDesconto && item.valorDesconto != null ? (
                            <S.ItemValue>
                              {item.tipoDesconto === "valor"
                                ? Number(item.valorDesconto).toLocaleString(
                                    "pt-BR",
                                    {
                                      style: "currency",
                                      currency: "BRL",
                                    },
                                  )
                                : `${item.valorDesconto}%`}
                            </S.ItemValue>
                          ) : (
                            <S.ItemValue>-</S.ItemValue>
                          )}
                        </S.PriceColumn>
                        <S.PriceColumn>
                          <S.ItemLabel>Subtotal</S.ItemLabel>
                          <S.ItemValue>
                            {Number(total).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </S.ItemValue>
                        </S.PriceColumn>
                      </S.ItemContainer>
                      <S.ItemActions>
                        <S.ToggleButton
                          type="button"
                          onClick={() => toggleItem(item.id)}
                        >
                          {aberto ? "- DETALHES" : "+ DETALHES"}
                        </S.ToggleButton>
                      </S.ItemActions>
                    </S.ItemHeader>

                    {aberto && (
                      <>
                        {(item.descricao || item.inclui || item.naoInclui) && (
                          <S.DetailsRow>
                            {item.descricao && (
                              <S.Field>
                                <S.ItemLabel>Descrição</S.ItemLabel>
                                <S.TextBlock>{item.descricao}</S.TextBlock>
                              </S.Field>
                            )}
                          </S.DetailsRow>
                        )}

                        {(item.inclui || item.naoInclui) && (
                          <>
                            {item.inclui && (
                              <S.DetailsRow>
                                <S.Field>
                                  <S.ItemLabel>Contempla</S.ItemLabel>
                                  <S.TextBlock>{item.inclui}</S.TextBlock>
                                </S.Field>
                              </S.DetailsRow>
                            )}
                            {item.naoInclui && (
                              <S.DetailsRow>
                                <S.Field>
                                  <S.ItemLabel>Não contempla</S.ItemLabel>
                                  <S.TextBlock>{item.naoInclui}</S.TextBlock>
                                </S.Field>
                              </S.DetailsRow>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </S.ItemCard>
                );
              })}
            </S.ItemsList>

            <S.Divider />

            <S.PriceFieldRow>
              <S.GeneratePdfButton
                type="button"
                onClick={() => proposta && gerarPdfPropostaSimples(proposta)}
              >
                Gerar PDF da proposta
              </S.GeneratePdfButton>
              {/*  <S.PrintPdfButton type="button" onClick={handleImprimirPdf}>
                Salvar PDF visual
              </S.PrintPdfButton> */}
              <S.TotalField>
                <S.Label>Valor total</S.Label>
                {(() => {
                  // Debug - verificar se tem desconto
                  const temDesconto =
                    (proposta.tipoDescontoGlobal === "valor" ||
                      proposta.tipoDescontoGlobal === "percentual") &&
                    proposta.valorDescontoGlobal !== null &&
                    proposta.valorDescontoGlobal !== undefined &&
                    Number(proposta.valorDescontoGlobal) > 0;

                  console.log("🎯 DEBUG Desconto Visual:", {
                    temDesconto,
                    tipo: proposta.tipoDescontoGlobal,
                    valor: proposta.valorDescontoGlobal,
                    valorTotal: proposta.valorTotal,
                  });

                  if (!temDesconto) {
                    return (
                      <S.TotalHighlight>
                        {Number(proposta.valorTotal).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </S.TotalHighlight>
                    );
                  }

                  // Calcular valores
                  const valorFinal = Number(proposta.valorTotal) || 0;
                  const valorDesc = Number(proposta.valorDescontoGlobal) || 0;
                  let subtotal = valorFinal;

                  if (proposta.tipoDescontoGlobal === "valor") {
                    subtotal = valorFinal + valorDesc;
                  } else if (proposta.tipoDescontoGlobal === "percentual") {
                    if (valorDesc > 0 && valorDesc < 100) {
                      subtotal = valorFinal / (1 - valorDesc / 100);
                    }
                  }

                  return (
                    <S.DiscountedPrice>
                      <S.OriginalPrice>
                        De{" "}
                        {Number(subtotal).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </S.OriginalPrice>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <S.FinalPrice>
                          por{" "}
                          {Number(valorFinal).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </S.FinalPrice>
                        <S.DiscountBadge>
                          {proposta.tipoDescontoGlobal === "percentual"
                            ? `-${Number(valorDesc)}%`
                            : `-${Number(valorDesc).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}`}
                        </S.DiscountBadge>
                      </div>
                    </S.DiscountedPrice>
                  );
                })()}
              </S.TotalField>
            </S.PriceFieldRow>
          </S.Content>
          <S.Footer>
            <S.FooterTitle style={{ color: primaryColor }}>
              Obrigado!
            </S.FooterTitle>
            <S.FooterNote>
              Vamos conversar sobre <br />
              <span style={{ color: primaryColor }}>
                {" "}
                o seu próximo projeto
              </span>
              ?
              <br />
              Ficamos à disposição
            </S.FooterNote>
            {proposta.marca?.logo ? (
              <S.FooterLogo
                src={proposta.marca.logo}
                alt={proposta.marca.name ?? ""}
              />
            ) : (
              <S.FooterTitle>FilmeLab</S.FooterTitle>
            )}
          </S.Footer>
        </S.ProposalShell>
      </S.PageWrapper>
    </>
  );
}
