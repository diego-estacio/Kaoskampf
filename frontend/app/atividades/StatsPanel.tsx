"use client";

import { useMemo, useState } from "react";
import * as S from "./Dashboard.styles";

type Janela7DiasStats = {
  hoje: number;
  ultimos7: number;
  total: number;
  variacao: number;
};

type DailyPoint = {
  label: string;
  value: number;
};

type StatsContatosTotais = {
  totalContatos: number;
  totalLeads: number;
  totalClientes: number;
};

type StatsPanelProps = {
  loadingStats: boolean;
  isAdminOrMaster: boolean;
  totalAtividadesHoje: number;
  cadastrosHoje: number;
  tentativasHoje: number;
  propostasHoje: number;
  statsTentativas: Janela7DiasStats;
  statsCadastrosContatos: Janela7DiasStats;
  statsEmpresasJanela: Janela7DiasStats;
  statsPropostasJanela: Janela7DiasStats;
  statsContatosTotais: StatsContatosTotais;
  tentativasDates: (string | Date)[];
  cadastrosContatoDates: (string | Date)[];
  empresasDates: (string | Date)[];
  propostasDates: (string | Date)[];
};

const buildDailySeries = (
  dates: (string | Date)[],
  days: number,
): DailyPoint[] => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const counts: Record<string, number> = {};

  dates.forEach((d) => {
    const data = typeof d === "string" ? new Date(d) : d;
    const dia = new Date(data);
    dia.setHours(0, 0, 0, 0);
    const key = dia.toISOString().slice(0, 10);
    counts[key] = (counts[key] || 0) + 1;
  });

  const result: DailyPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const dia = new Date(hoje);
    dia.setDate(hoje.getDate() - i);
    const key = dia.toISOString().slice(0, 10);
    const label = `${dia.getDate().toString().padStart(2, "0")}/${(
      dia.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;

    result.push({ label, value: counts[key] || 0 });
  }

  return result;
};

export function StatsPanel({
  loadingStats,
  isAdminOrMaster,
  totalAtividadesHoje,
  cadastrosHoje,
  tentativasHoje,
  propostasHoje,
  statsTentativas,
  statsCadastrosContatos,
  statsEmpresasJanela,
  statsPropostasJanela,
  statsContatosTotais,
  tentativasDates,
  cadastrosContatoDates,
  empresasDates,
  propostasDates,
}: StatsPanelProps) {
  const [viewMode, setViewMode] = useState<"cards" | "grafico">("cards");
  const [chartRange, setChartRange] = useState<15 | 30 | 60>(30);

  const serieTentativas = useMemo(
    () => buildDailySeries(tentativasDates, chartRange),
    [tentativasDates, chartRange],
  );

  const serieCadastrosContato = useMemo(
    () => buildDailySeries(cadastrosContatoDates, chartRange),
    [cadastrosContatoDates, chartRange],
  );

  const serieEmpresas = useMemo(
    () => buildDailySeries(empresasDates, chartRange),
    [empresasDates, chartRange],
  );

  const seriePropostas = useMemo(
    () => buildDailySeries(propostasDates, chartRange),
    [propostasDates, chartRange],
  );

  return (
    <S.StatsGrid>
      <S.StatsMainCard>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem",
              }}
            >
              <S.StatTitle style={{ fontSize: "1.1rem", lineHeight: "1" }}>
                Atividades de hoje:
              </S.StatTitle>
              <S.StatValue>
                {loadingStats ? "..." : totalAtividadesHoje}
              </S.StatValue>
            </div>

            <S.ViewToggle>
              <S.ViewToggleButton
                type="button"
                $active={viewMode === "cards"}
                onClick={() => setViewMode("cards")}
              >
                Cards
              </S.ViewToggleButton>
              <S.ViewToggleButton
                type="button"
                $active={viewMode === "grafico"}
                onClick={() => setViewMode("grafico")}
              >
                Gráfico
              </S.ViewToggleButton>
            </S.ViewToggle>
          </div>

          <S.StatSecondary>
            {isAdminOrMaster
              ? "Visão consolidada das atividades da equipe hoje."
              : "Visão consolidada das suas atividades hoje."}
          </S.StatSecondary>
          <S.StatChange>
            {loadingStats
              ? "Carregando..."
              : `Cadastros: ${statsCadastrosContatos.hoje} • Tentativas de contato: ${tentativasHoje} • Propostas: ${propostasHoje}`}
          </S.StatChange>
          {viewMode === "grafico" && (
            <S.ChartContainer>
              <S.ChartTabs>
                <S.ChartTabButton
                  type="button"
                  $active={chartRange === 15}
                  onClick={() => setChartRange(15)}
                >
                  15 dias
                </S.ChartTabButton>
                <S.ChartTabButton
                  type="button"
                  $active={chartRange === 30}
                  onClick={() => setChartRange(30)}
                >
                  30 dias
                </S.ChartTabButton>
                <S.ChartTabButton
                  type="button"
                  $active={chartRange === 60}
                  onClick={() => setChartRange(60)}
                >
                  60 dias
                </S.ChartTabButton>
              </S.ChartTabs>

              {[
                { label: "Tentativas de contato", serie: serieTentativas },
                {
                  label: "Cadastros de contatos",
                  serie: serieCadastrosContato,
                },
                { label: "Empresas cadastradas", serie: serieEmpresas },
                { label: "Propostas criadas", serie: seriePropostas },
              ].map(({ label, serie }) => {
                const max = Math.max(1, ...serie.map((p) => p.value));

                return (
                  <div key={label} style={{ marginTop: "1rem" }}>
                    <S.StatTitle style={{ marginBottom: "0.25rem" }}>
                      {label}
                    </S.StatTitle>
                    <S.ChartBars>
                      {serie.map((p) => (
                        <S.ChartBar
                          key={p.label}
                          $height={(p.value / max) * 100}
                          title={`${p.label}: ${p.value}`}
                        />
                      ))}
                    </S.ChartBars>
                    <S.ChartAxisLabels>
                      {serie.length > 0 && (
                        <>
                          <span>{serie[0].label}</span>
                          <span>{serie[serie.length - 1].label}</span>
                        </>
                      )}
                    </S.ChartAxisLabels>
                  </div>
                );
              })}
            </S.ChartContainer>
          )}
        </div>
      </S.StatsMainCard>

      {viewMode === "cards" && (
        <>
          {/* Tentativas de contato */}
          <S.StatCard>
            <S.StatTitle>Tentativas de contato</S.StatTitle>
            <S.StatValue>
              {loadingStats ? "..." : statsTentativas.hoje}
            </S.StatValue>
            <S.StatChange>
              {loadingStats
                ? "Carregando..."
                : `Últimos 7 dias: ${statsTentativas.ultimos7} `}
            </S.StatChange>
            <S.StatSecondary>
              {loadingStats
                ? "Carregando..."
                : `Histórico: ${statsTentativas.total} tentativas registradas`}
            </S.StatSecondary>
          </S.StatCard>

          {/* Cadastros de contatos */}
          <S.StatCard>
            <S.StatTitle>Cadastros de contatos</S.StatTitle>
            <S.StatValue>
              {loadingStats ? "..." : statsCadastrosContatos.hoje}
            </S.StatValue>
            <S.StatChange>
              {loadingStats
                ? "Carregando..."
                : `Últimos 7 dias: ${statsCadastrosContatos.ultimos7} `}
            </S.StatChange>
            <S.StatSecondary>
              {loadingStats
                ? "Carregando..."
                : `Clientes: ${statsContatosTotais.totalClientes} • Leads: ${statsContatosTotais.totalLeads} • Histórico: ${statsCadastrosContatos.total} contatos`}
            </S.StatSecondary>
          </S.StatCard>

          {/* Empresas cadastradas */}
          <S.StatCard>
            <S.StatTitle>Empresas cadastradas</S.StatTitle>
            <S.StatValue>
              {loadingStats ? "..." : statsEmpresasJanela.hoje}
            </S.StatValue>
            <S.StatChange>
              {loadingStats
                ? "Carregando..."
                : `Últimos 7 dias: ${statsEmpresasJanela.ultimos7} `}
            </S.StatChange>
            <S.StatSecondary>
              {loadingStats
                ? "Carregando..."
                : `Histórico: ${statsEmpresasJanela.total} empresas cadastradas no sistema`}
            </S.StatSecondary>
          </S.StatCard>

          {/* Propostas criadas */}
          <S.StatCard>
            <S.StatTitle>Propostas criadas</S.StatTitle>
            <S.StatValue>{loadingStats ? "..." : propostasHoje}</S.StatValue>
            <S.StatChange>
              {loadingStats
                ? "Carregando..."
                : `Últimos 7 dias: ${statsPropostasJanela.ultimos7} `}
            </S.StatChange>
            <S.StatSecondary>
              {loadingStats
                ? "Carregando..."
                : `Histórico: ${statsPropostasJanela.total} propostas registradas na timeline`}
            </S.StatSecondary>
          </S.StatCard>
        </>
      )}
    </S.StatsGrid>
  );
}
