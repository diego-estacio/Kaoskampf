"use client";

import { useState, useEffect, useCallback } from "react";
import * as S from "./Dashboard.styles";
import { PageHeader } from "../contatos/styles";
import { apiService } from "../../src/services/api";
import {
  TipoAtividade,
  Contato,
  Empresa,
  Timeline,
  Proposta,
} from "../../src/types";
import {
  MdGroups,
  MdPersonAdd,
  MdPhone,
  MdStickyNote2,
  MdDescription,
  MdUpdate,
  MdOpenInNew,
} from "react-icons/md";
import Link from "next/link";
import { formatarPorcentagem } from "../../src/utils/dashboardUtils";
import { formatRelativeTime } from "../../src/utils/dateUtils";
import { usePaginatedTimeline } from "../../src/hooks/usePaginatedTimeline";
import { Pagination } from "../../src/components/common/Pagination";
import { useAuthStore } from "../../src/stores/authStore";
import { FileX } from "lucide-react";
import { StatsPanel } from "./StatsPanel";

type Janela7DiasStats = {
  hoje: number;
  ultimos7: number;
  total: number;
  variacao: number;
};

const calcularJanela7Dias = (datas: (string | Date)[]): Janela7DiasStats => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const seteDiasAtras = new Date(hoje);
  seteDiasAtras.setDate(hoje.getDate() - 7);

  const quatorzeDiasAtras = new Date(hoje);
  quatorzeDiasAtras.setDate(hoje.getDate() - 14);

  let hojeCount = 0;
  let ultimos7 = 0;
  let anteriores7 = 0;

  datas.forEach((d) => {
    const data = typeof d === "string" ? new Date(d) : d;
    const dataDia = new Date(data);
    dataDia.setHours(0, 0, 0, 0);

    if (dataDia.getTime() === hoje.getTime()) {
      hojeCount++;
    }

    if (dataDia >= seteDiasAtras) {
      ultimos7++;
    } else if (dataDia >= quatorzeDiasAtras && dataDia < seteDiasAtras) {
      anteriores7++;
    }
  });

  let variacao = 0;
  if (anteriores7 > 0) {
    variacao = ((ultimos7 - anteriores7) / anteriores7) * 100;
  } else if (ultimos7 > 0) {
    variacao = 100;
  }

  return {
    hoje: hojeCount,
    ultimos7,
    total: datas.length,
    variacao: Math.round(variacao),
  };
};

export default function Dashboard() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [timelineUsuario, setTimelineUsuario] = useState<Timeline[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const { usuario } = useAuthStore();

  // Hook de paginação para timeline
  const {
    items: timeline,
    currentPage,
    totalPages,
    loading: loadingTimeline,
    goToPage,
  } = usePaginatedTimeline({
    type: "geral",
    itemsPerPage: 5,
  });

  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const [contatosData, empresasData, propostasData, timelineUsuarioData] =
        await Promise.all([
          apiService.buscarContatos(),
          apiService.buscarEmpresas(),
          apiService.listarPropostas(),
          usuario?.id
            ? apiService.buscarTimelineUsuario(usuario.id)
            : apiService.buscarTimelineRecente(),
        ]);

      setContatos(contatosData);
      setEmpresas(empresasData);
      setPropostas(propostasData);
      setTimelineUsuario(timelineUsuarioData);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoadingStats(false);
    }
  }, [usuario?.id]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Calcular estatísticas baseadas no usuário logado
  const isAdminOrMaster =
    usuario?.role === "ADMIN" || usuario?.role === "MASTER";

  const timelineBase = isAdminOrMaster
    ? timeline
    : timelineUsuario.length > 0
      ? timelineUsuario
      : timeline;
  const hojeRef = new Date();
  hojeRef.setHours(0, 0, 0, 0);

  const atividadesHoje = timelineBase.filter((a) => {
    const data = new Date(a.criadoEm);
    const dataDia = new Date(data);
    dataDia.setHours(0, 0, 0, 0);
    return dataDia.getTime() === hojeRef.getTime();
  });

  const totalAtividadesHoje = atividadesHoje.length;
  const cadastrosHoje = atividadesHoje.filter(
    (a) => a.tipo === TipoAtividade.CADASTRO,
  ).length;
  const tentativasHoje = atividadesHoje.filter(
    (a) => a.tipo === TipoAtividade.TENTATIVA_CONTATO,
  ).length;

  const currentUserId = usuario?.id;

  const contatosUsuario = currentUserId
    ? contatos.filter((c) => c.usuarioCriadorId === currentUserId)
    : contatos;

  const contatosBase = isAdminOrMaster ? contatos : contatosUsuario;

  const totalLeads = contatosBase.filter(
    (c) => c.tipoContato === "lead",
  ).length;

  const totalClientes = contatosBase.filter(
    (c) => c.tipoContato === "cliente",
  ).length;

  const totalEmpresasTrabalhadas = new Set(
    contatosBase.map((c) => c.empresaId).filter(Boolean),
  ).size;

  const propostasUsuario = currentUserId
    ? propostas.filter((p) => p.usuarioCriadorId === currentUserId)
    : propostas;

  const propostasBase = isAdminOrMaster ? propostas : propostasUsuario;

  const propostasHoje = propostasUsuario.filter((p) => {
    const data = new Date(p.criadoEm);
    const dataDia = new Date(data);
    dataDia.setHours(0, 0, 0, 0);
    return dataDia.getTime() === hojeRef.getTime();
  }).length;

  // Estatísticas em janelas de 7 dias
  const statsTentativas = calcularJanela7Dias(
    timelineBase
      .filter((a) => a.tipo === TipoAtividade.TENTATIVA_CONTATO)
      .map((a) => a.criadoEm),
  );

  const statsCadastrosContatos = calcularJanela7Dias(
    contatosBase.map((c) => c.criadoEm),
  );

  const statsEmpresasJanela = calcularJanela7Dias(
    empresas.map((e) => e.criadoEm),
  );

  const statsPropostasJanela = calcularJanela7Dias(
    propostasBase.map((p) => p.criadoEm),
  );

  const statsContatosTotais = {
    totalContatos: contatosBase.length,
    totalLeads: totalLeads,
    totalClientes: totalClientes,
  };

  const getTimelineIcon = (tipo: TipoAtividade) => {
    switch (tipo) {
      case TipoAtividade.REUNIAO:
        return <MdGroups />;
      case TipoAtividade.CADASTRO:
        return <MdPersonAdd />;
      case TipoAtividade.TENTATIVA_CONTATO:
        return <MdPhone />;
      case TipoAtividade.OBSERVACAO:
        return <MdStickyNote2 />;
      case TipoAtividade.PROPOSTA:
        return <MdDescription />;
      case TipoAtividade.ATUALIZACAO:
        return <MdUpdate />;
      default:
        return <MdUpdate />;
    }
  };

  return (
    <S.DashboardContainer>
      <S.MainContent>
        <S.TimelineContainer>
          <PageHeader>
            <S.PageTitle>
              {isAdminOrMaster
                ? "Timeline de Atividades — Todos os Usuários"
                : "Timeline de Atividades da Equipe"}
            </S.PageTitle>
          </PageHeader>
          {loadingTimeline ? (
            <S.LoadingContainer>Carregando atividades...</S.LoadingContainer>
          ) : timeline.length === 0 ? (
            <S.EmptyMessage>Nenhuma atividade registrada ainda</S.EmptyMessage>
          ) : (
            <>
              {timeline.map((item) => (
                <S.TimelineItem key={item.id}>
                  <S.TimelineIcon>{getTimelineIcon(item.tipo)}</S.TimelineIcon>
                  <S.TimelineContent>
                    <S.TimelineHeader>
                      <S.TimelineTitle>{item.atividade}</S.TimelineTitle>
                      <S.TimelineTime>
                        {formatRelativeTime(item.criadoEm)}
                      </S.TimelineTime>
                    </S.TimelineHeader>

                    <S.TimelineUser>
                      {item.usuario?.nome || "Usuário"}
                    </S.TimelineUser>

                    {item.descricao && (
                      <S.TimelineDescription>
                        {item.descricao}
                      </S.TimelineDescription>
                    )}

                    {item.contato && (
                      <S.TimelineMetadata>
                        <S.TimelineContact>
                          {item.contato.nome}
                        </S.TimelineContact>
                        {item.contato.empresa && (
                          <>
                            <S.TimelineSeparator>•</S.TimelineSeparator>
                            <S.TimelineEmpresa>
                              {item.contato.empresa.nome}
                            </S.TimelineEmpresa>
                          </>
                        )}
                        <Link
                          href={`/contatos/${item.contato.id}`}
                          passHref
                          legacyBehavior
                        >
                          <S.TimelineLink>
                            <MdOpenInNew /> Ver Perfil
                          </S.TimelineLink>
                        </Link>
                      </S.TimelineMetadata>
                    )}
                  </S.TimelineContent>
                </S.TimelineItem>
              ))}

              {/* Paginação */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </>
          )}
        </S.TimelineContainer>

        <StatsPanel
          loadingStats={loadingStats}
          isAdminOrMaster={isAdminOrMaster}
          totalAtividadesHoje={totalAtividadesHoje}
          cadastrosHoje={cadastrosHoje}
          tentativasHoje={tentativasHoje}
          propostasHoje={propostasHoje}
          statsTentativas={statsTentativas}
          statsCadastrosContatos={statsCadastrosContatos}
          statsEmpresasJanela={statsEmpresasJanela}
          statsPropostasJanela={statsPropostasJanela}
          statsContatosTotais={statsContatosTotais}
          tentativasDates={timelineBase
            .filter((a) => a.tipo === TipoAtividade.TENTATIVA_CONTATO)
            .map((a) => a.criadoEm)}
          cadastrosContatoDates={contatosBase.map((c) => c.criadoEm)}
          empresasDates={empresas.map((e) => e.criadoEm)}
          propostasDates={propostasBase.map((p) => p.criadoEm)}
        />
      </S.MainContent>
    </S.DashboardContainer>
  );
}
