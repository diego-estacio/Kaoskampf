"use client";

import { useMemo } from "react";
import * as S from "./styles";
import { TipoAtividade, Contato, Proposta, Timeline } from "../../../src/types";
import {
  MdPersonAdd,
  MdBusiness,
  MdDescription,
  MdPhone,
} from "react-icons/md";

interface Metric {
  label: string;
  value: number;
  sub: string;
  dates: string[];
  color: string;
  icon: React.ReactNode;
}

function buildSparkData(dates: string[], days = 7): number[] {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const counts: Record<string, number> = {};
  dates.forEach((d) => {
    const dia = new Date(d);
    dia.setHours(0, 0, 0, 0);
    const k = dia.toISOString().slice(0, 10);
    counts[k] = (counts[k] || 0) + 1;
  });

  const result: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const dia = new Date(hoje);
    dia.setDate(hoje.getDate() - i);
    const k = dia.toISOString().slice(0, 10);
    result.push(counts[k] || 0);
  }
  return result;
}

function calcTrend(dates: string[]): { value: number; up: boolean } {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const seteDias = new Date(hoje);
  seteDias.setDate(hoje.getDate() - 7);
  const quatorze = new Date(hoje);
  quatorze.setDate(hoje.getDate() - 14);

  let curr = 0;
  let prev = 0;
  dates.forEach((d) => {
    const dia = new Date(d);
    dia.setHours(0, 0, 0, 0);
    if (dia >= seteDias) curr++;
    else if (dia >= quatorze) prev++;
  });

  if (prev === 0) return { value: curr > 0 ? 100 : 0, up: true };
  const pct = Math.round(((curr - prev) / prev) * 100);
  return { value: Math.abs(pct), up: pct >= 0 };
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(1, ...data);
  return (
    <S.SparklineWrap>
      {data.map((v, i) => (
        <S.SparkBar
          key={i}
          $height={Math.max(8, Math.round((v / max) * 100))}
          $color={color}
          title={`${v}`}
        />
      ))}
    </S.SparklineWrap>
  );
}

interface UserStatsPanelProps {
  loading: boolean;
  contatos: Contato[];
  propostas: Proposta[];
  timeline: Timeline[];
  userId: string;
}

export function UserStatsPanel({
  loading,
  contatos,
  propostas,
  timeline,
  userId,
}: UserStatsPanelProps) {
  const userContatos = useMemo(
    () => contatos.filter((c) => c.usuarioCriadorId === userId),
    [contatos, userId],
  );

  const userPropostas = useMemo(
    () => propostas.filter((p) => p.usuarioCriadorId === userId),
    [propostas, userId],
  );

  const tentativas = useMemo(
    () => timeline.filter((t) => t.tipo === TipoAtividade.TENTATIVA_CONTATO),
    [timeline],
  );

  const empresasUnicas = useMemo(
    () => new Set(userContatos.map((c) => c.empresaId).filter(Boolean)).size,
    [userContatos],
  );

  const metrics: Metric[] = useMemo(
    () => [
      {
        label: "Contatos cadastrados",
        value: userContatos.length,
        sub: `${userContatos.filter((c) => c.tipoContato === "cliente").length} clientes · ${userContatos.filter((c) => c.tipoContato === "lead").length} leads`,
        dates: userContatos.map((c) => c.criadoEm),
        color: "#6366f1",
        icon: <MdPersonAdd />,
      },
      {
        label: "Empresas atendidas",
        value: empresasUnicas,
        sub: "Empresas únicas nos contatos",
        dates: userContatos.map((c) => c.criadoEm),
        color: "#0ea5e9",
        icon: <MdBusiness />,
      },
      {
        label: "Propostas criadas",
        value: userPropostas.length,
        sub: `${userPropostas.filter((p) => p.status === "aprovada").length} aprovadas`,
        dates: userPropostas.map((p) => p.criadoEm),
        color: "#10b981",
        icon: <MdDescription />,
      },
      {
        label: "Tentativas de contato",
        value: tentativas.length,
        sub: "Registradas na timeline",
        dates: tentativas.map((t) => t.criadoEm),
        color: "#f59e0b",
        icon: <MdPhone />,
      },
    ],
    [userContatos, userPropostas, tentativas, empresasUnicas],
  );

  if (loading) {
    return <S.EmptyMessage>Carregando estatísticas...</S.EmptyMessage>;
  }

  return (
    <S.StatsPanelWrap>
      <S.StatsPanelTitle>Estatísticas do usuário</S.StatsPanelTitle>
      <S.StatsPanelSub>
        Visão geral da atividade nos últimos 7 dias e histórico total
      </S.StatsPanelSub>
      <S.StatsMetricsGrid>
        {metrics.map((m) => {
          const spark = buildSparkData(m.dates, 7);
          const trend = calcTrend(m.dates);
          return (
            <S.MetricCard key={m.label} $accent={m.color}>
              <S.MetricLeft>
                <S.MetricIconWrap $color={m.color}>{m.icon}</S.MetricIconWrap>
                <S.MetricLabel>{m.label}</S.MetricLabel>
                <S.MetricNumber>
                  {m.value.toLocaleString("pt-BR")}
                </S.MetricNumber>
                <S.MetricSub>{m.sub}</S.MetricSub>
                <S.MetricTrend $up={trend.up}>
                  {trend.up ? "↑" : "↓"} {trend.value}% últimos 7 dias
                </S.MetricTrend>
              </S.MetricLeft>
              <S.MetricRight>
                <S.SparkLabel>7 dias</S.SparkLabel>
                <Sparkline data={spark} color={m.color} />
                <S.SparkDayLabels>
                  <span>-6d</span>
                  <span>hoje</span>
                </S.SparkDayLabels>
              </S.MetricRight>
            </S.MetricCard>
          );
        })}
      </S.StatsMetricsGrid>
    </S.StatsPanelWrap>
  );
}
