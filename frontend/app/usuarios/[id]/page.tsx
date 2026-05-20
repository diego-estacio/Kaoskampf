"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  MdGroups,
  MdPersonAdd,
  MdDescription,
  MdStickyNote2,
  MdUpdate,
  MdPhone,
  MdEvent,
  MdOpenInNew,
} from "react-icons/md";
import Link from "next/link";
import Breadcrumbs from "../../../src/components/common/Breadcrumbs";
import {
  PageContainer,
  MainContent,
} from "../../../src/components/common/Layout.styles";
import { apiService } from "../../../src/services/api";
import { mockData, formatUtils } from "../../../src/utils";
import {
  TipoAtividade,
  Contato,
  Proposta,
  Timeline as TimelineType,
} from "../../../src/types";
import { usePaginatedTimeline } from "../../../src/hooks/usePaginatedTimeline";
import { Pagination } from "../../../src/components/common/Pagination";
import * as S from "./styles";
import { formatRelativeTime } from "../../../src/utils/dateUtils";
import { UserStatsPanel } from "./UserStatsPanel";

interface Usuario {
  id: string;
  nome: string;
  login: string;
  email: string;
  funcao: string;
  notificacoesAtivadas?: boolean;
  atualizadoEm?: string;
  criadoEm?: string;
}

export default function UserPage() {
  const params = useParams();
  const userId = params.id as string;
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View toggle: timeline or stats
  const [activeView, setActiveView] = useState<"timeline" | "stats">(
    "timeline",
  );

  // Stats data
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [timelineCompleta, setTimelineCompleta] = useState<TimelineType[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Hook de paginação para timeline do usuário
  const {
    items: timeline,
    currentPage,
    totalPages,
    loading: loadingTimeline,
    goToPage,
  } = usePaginatedTimeline({
    type: "usuario",
    entityId: userId,
    itemsPerPage: 5,
  });

  const loadUsuario = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar via API
      const resultado = await apiService.buscarUsuario(userId);
      setUsuario(resultado);
    } catch (error) {
      console.warn("Erro na API, usando dados mockados:", error);

      // Fallback para mock data
      const usuarioMock = mockData.usuarios.find(
        (u) => u.id.toString() === userId,
      );

      if (usuarioMock) {
        setUsuario({
          ...usuarioMock,
          id: usuarioMock.id.toString(),
        });
      } else {
        setError("Usuário não encontrado");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const [contatosData, propostasData, timelineData] = await Promise.all([
        apiService.buscarContatos(),
        apiService.listarPropostas(),
        apiService.buscarTimelineUsuario(userId),
      ]);
      setContatos(contatosData);
      setPropostas(propostasData);
      setTimelineCompleta(timelineData);
    } catch (err) {
      console.error("Erro ao carregar estatísticas:", err);
    } finally {
      setLoadingStats(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadUsuario();
      loadStats();
    }
  }, [userId, loadUsuario, loadStats]);

  const getTimelineIcon = (tipo: TipoAtividade) => {
    switch (tipo) {
      case TipoAtividade.REUNIAO:
        return <MdGroups />;
      case TipoAtividade.CADASTRO:
        return <MdPersonAdd />;
      case TipoAtividade.PROPOSTA:
        return <MdDescription />;
      case TipoAtividade.OBSERVACAO:
        return <MdStickyNote2 />;
      case TipoAtividade.TENTATIVA_CONTATO:
        return <MdPhone />;
      case TipoAtividade.ATUALIZACAO:
        return <MdUpdate />;
      default:
        return <MdEvent />;
    }
  };

  // Buscar a última atividade real da timeline
  const ultimaAtividadeTimeline =
    timeline.length > 0 ? timeline[0].criadoEm : usuario?.atualizadoEm;

  if (loading) {
    return (
      <PageContainer>
        <MainContent>
          <S.LoadingContainer>Carregando usuário...</S.LoadingContainer>
        </MainContent>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <MainContent>
          <S.ErrorContainer>{error}</S.ErrorContainer>
        </MainContent>
      </PageContainer>
    );
  }

  if (!usuario) {
    return (
      <PageContainer>
        <MainContent>
          <S.ErrorContainer>Usuário não encontrado</S.ErrorContainer>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Usuários", href: "/usuarios" },
          { label: usuario.nome },
        ]}
      />

      <S.UserContent>
        {/* Perfil do Usuário */}
        <S.UserProfile>
          <S.ProfileHeader>
            <S.UserAvatar>{formatUtils.getInitials(usuario.nome)}</S.UserAvatar>
            <S.UserDetails>
              <S.UserName>{usuario.nome}</S.UserName>
              <S.UserRole>{usuario.funcao}</S.UserRole>
            </S.UserDetails>
          </S.ProfileHeader>
          <S.UserDetails>
            <S.UserInfo>
              <S.InfoItem>
                <S.InfoLabel>Email:</S.InfoLabel>
                <S.InfoValue>{usuario.email}</S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Login:</S.InfoLabel>
                <S.InfoValue>{usuario.login}</S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Notificações:</S.InfoLabel>
                <S.InfoValue>
                  <S.StatusBadge
                    $active={usuario.notificacoesAtivadas || false}
                  >
                    {usuario.notificacoesAtivadas ? "Ativas" : "Inativas"}
                  </S.StatusBadge>
                </S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Última atividade:</S.InfoLabel>
                <S.InfoValue>
                  {ultimaAtividadeTimeline
                    ? formatRelativeTime(ultimaAtividadeTimeline)
                    : "Sem atividade recente"}
                </S.InfoValue>
              </S.InfoItem>
            </S.UserInfo>
          </S.UserDetails>
        </S.UserProfile>

        {/* Timeline / Stats Section */}
        <S.TimelineSection>
          <S.TimelineSectionHeader>
            <S.TimelineTitle style={{ margin: 0 }}>
              Atividade do usuário
            </S.TimelineTitle>
            <S.ViewToggleBar>
              <S.ToggleBtn
                type="button"
                $active={activeView === "timeline"}
                onClick={() => setActiveView("timeline")}
              >
                Timeline
              </S.ToggleBtn>
              <S.ToggleBtn
                type="button"
                $active={activeView === "stats"}
                onClick={() => setActiveView("stats")}
              >
                Estatísticas
              </S.ToggleBtn>
            </S.ViewToggleBar>
          </S.TimelineSectionHeader>
          {activeView === "stats" ? (
            <UserStatsPanel
              loading={loadingStats}
              contatos={contatos}
              propostas={propostas}
              timeline={timelineCompleta}
              userId={userId}
            />
          ) : loadingTimeline ? (
            <S.LoadingContainer>Carregando atividades...</S.LoadingContainer>
          ) : timeline.length === 0 ? (
            <S.EmptyMessage>Nenhuma atividade registrada ainda</S.EmptyMessage>
          ) : (
            <>
              <S.TimelineList>
                {timeline.map((item) => (
                  <S.TimelineItem key={item.id}>
                    <S.TimelineIcon>
                      {getTimelineIcon(item.tipo)}
                    </S.TimelineIcon>
                    <S.TimelineContent>
                      <S.TimelineActivity>{item.atividade}</S.TimelineActivity>
                      {item.descricao && (
                        <S.TimelineDetails>{item.descricao}</S.TimelineDetails>
                      )}
                      {item.contato && (
                        <S.TimelineDetails
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>
                            Contato: {item.contato.nome}
                            {item.contato.empresa &&
                              ` - ${item.contato.empresa.nome}`}
                          </span>
                          <Link
                            href={`/contatos/${item.contato.id}`}
                            passHref
                            legacyBehavior
                          >
                            <S.TimelineLink>
                              <MdOpenInNew /> Ver Perfil
                            </S.TimelineLink>
                          </Link>
                        </S.TimelineDetails>
                      )}
                      <S.TimelineTime>
                        {formatRelativeTime(item.criadoEm)}
                      </S.TimelineTime>
                    </S.TimelineContent>
                  </S.TimelineItem>
                ))}
              </S.TimelineList>

              {/* Paginação */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </>
          )}
        </S.TimelineSection>
      </S.UserContent>
    </PageContainer>
  );
}
