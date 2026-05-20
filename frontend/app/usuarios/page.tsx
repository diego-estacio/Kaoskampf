"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, UserCheck, UserX } from "lucide-react";
import ViewToggle, { ViewMode } from "../../src/components/common/ViewToggle";
import { useAuthStore } from "../../src/stores/authStore";
import {
  PageContainer,
  MainContent,
  PageHeader,
  HeaderContent,
  PageTitle,
  PageSubtitle,
} from "../../src/components/common/Layout.styles";
import { mockData, formatUtils } from "../../src/utils";
import { apiService } from "../../src/services/api";
import * as S from "./styles";

// Interface local para compatibilidade com dados mock e API
interface UsuarioLocal {
  id: string;
  nome: string;
  login: string;
  email: string;
  funcao: string;
  role?: "MASTER" | "ADMIN" | "MEMBER";
  autorizado?: boolean;
  notificacoesAtivadas?: boolean;
  diasAntesContato?: number;
  ultimaAtividade?: string;
  notificacoes?: {
    ativada: boolean;
    diasAntes: number;
  };
  criadoEm?: string;
  atualizadoEm?: string;
}

export default function Usuarios() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<UsuarioLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuthStore();
 
  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "MASTER";

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiService.buscarUsuarios();

      // Para cada usuário, buscar a última atividade da timeline
      const usuariosMapeados: UsuarioLocal[] = await Promise.all(
        data.map(async (usuario) => {
          let ultimaAtividade = usuario.criadoEm;

          try {
            // Buscar timeline do usuário (mesma lógica de /usuarios/[id])
            const timeline = await apiService.buscarTimelineUsuario(
              usuario.id,
              1,
            );
            if (timeline.length > 0) {
              // Pegar a atividade mais recente
              ultimaAtividade = timeline[0].criadoEm;
            }
          } catch (error) {
            console.log(
              `Timeline não encontrada para ${usuario.nome}, usando criadoEm`,
            );
          }

          return {
            id: usuario.id,
            nome: usuario.nome,
            login: usuario.login,
            email: usuario.email,
            funcao: usuario.funcao,
            autorizado: usuario.autorizado,
            notificacoesAtivadas: usuario.notificacoes?.ativada || false,
            diasAntesContato: usuario.notificacoes?.diasAntes || 1,
            ultimaAtividade: ultimaAtividade,
            notificacoes: usuario.notificacoes,
            criadoEm: usuario.criadoEm,
            atualizadoEm: usuario.atualizadoEm,
          };
        }),
      );

      setUsuarios(usuariosMapeados);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setError("Erro ao carregar usuários. Usando dados de demonstração.");

      // Fallback para dados mock em caso de erro
      const usuariosMock: UsuarioLocal[] = mockData.usuarios.map((usuario) => ({
        ...usuario,
        id: usuario.id.toString(),
        ultimaAtividade: usuario.atualizadoEm,
      }));
      setUsuarios(usuariosMock);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    router.push(`/usuarios/${userId}`);
  };
 
  const handleToggleAutorizacao = async (
    e: React.MouseEvent,
    usuarioId: string,
    novoStatus: boolean,
  ) => {
    e.stopPropagation();
    if (!isAdmin) return;
 
    const acao = novoStatus ? "autorizar" : "revogar o acesso do";
    if (!confirm(`Tem certeza que deseja ${acao} usuário?`)) return;
 
    try {
      await apiService.autorizarUsuario(usuarioId, novoStatus);
      // Recarregar lista
      loadUsuarios();
    } catch (error) {
      console.error(`Erro ao ${acao} usuário:`, error);
      alert(`Erro ao ${acao} usuário.`);
    }
  };

  const isUserOnline = (ultimaAtividade?: string) => {
    if (!ultimaAtividade) return false;
    const agora = new Date();
    const ultimaAtiv = new Date(ultimaAtividade);
    if (isNaN(ultimaAtiv.getTime())) return false;
    const diffMinutos = (agora.getTime() - ultimaAtiv.getTime()) / (1000 * 60);
    return diffMinutos < 30; // Online se ativo nos últimos 30 minutos
  };

  const getTempoUltimaAtividade = (ultimaAtividade?: string) => {
    if (!ultimaAtividade) return "Sem atividade";

    const agora = new Date();
    const ultimaAtiv = new Date(ultimaAtividade);

    // Validar se a data é válida
    if (isNaN(ultimaAtiv.getTime())) return "Data inválida";

    const diffMinutos = Math.floor(
      (agora.getTime() - ultimaAtiv.getTime()) / (1000 * 60),
    );

    if (diffMinutos < 1) return "Agora";
    if (diffMinutos < 60) return `${diffMinutos}min atrás`;

    const diffHoras = Math.floor(diffMinutos / 60);
    if (diffHoras < 24) return `${diffHoras}h atrás`;

    const diffDias = Math.floor(diffHoras / 24);
    return `${diffDias}d atrás`;
  };

  const searchLower = searchTerm.trim().toLowerCase();
  const usuariosFiltrados = usuarios.filter((usuario) => {
    // 1. Filtrar perfis administrativos (Admin e Master)
    if (usuario.role === "ADMIN" || usuario.role === "MASTER") {
      return false;
    }

    // 2. Aplicar filtro de busca
    if (searchLower && !usuario.nome.toLowerCase().includes(searchLower)) {
      return false;
    }

    return true;
  });

  return (
    <PageContainer>
      <MainContent>
        <PageHeader>
          <HeaderContent>
            <PageTitle>Usuários do Sistema</PageTitle>
            <PageSubtitle>({usuarios.length} usuários)</PageSubtitle>
          </HeaderContent>
          <S.HeaderActions>
            <S.SearchContainer>
              <Search size={16} />
              <S.SearchInput
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </S.SearchContainer>
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
          </S.HeaderActions>
        </PageHeader>

        {error && <S.ErrorContainer>{error}</S.ErrorContainer>}

        {loading ? (
          <S.LoadingContainer>Carregando usuários...</S.LoadingContainer>
        ) : viewMode === "grid" ? (
          <S.UsersGrid>
            {usuariosFiltrados.map((usuario) => (
              <S.UserCard
                key={usuario.id}
                onClick={() => handleUserClick(usuario.id)}
                $autorizado={usuario.autorizado}
              >
                <S.UserHeader>
                  <S.UserAvatar>
                    {formatUtils.getInitials(usuario.nome)}
                  </S.UserAvatar>
                  <S.UserInfo>
                    <S.UserName>{usuario.nome}</S.UserName>
                    <S.UserRole>{usuario.funcao}</S.UserRole>
                    <S.UserStatus
                      $online={isUserOnline(usuario.ultimaAtividade)}
                    >
                      <S.StatusDot
                        $online={isUserOnline(usuario.ultimaAtividade)}
                      />
                      {isUserOnline(usuario.ultimaAtividade)
                        ? "Online"
                        : "Offline"}
                    </S.UserStatus>
                  </S.UserInfo>
                </S.UserHeader>

                <S.UserDetails>
                  <S.UserDetail>
                    <S.DetailLabel>Email:</S.DetailLabel>
                    <S.DetailValue>{usuario.email}</S.DetailValue>
                  </S.UserDetail>
                  <S.UserDetail>
                    <S.DetailLabel>Login:</S.DetailLabel>
                    <S.DetailValue>{usuario.login}</S.DetailValue>
                  </S.UserDetail>
                  <S.UserDetail>
                    <S.DetailLabel>Notificações:</S.DetailLabel>
                    <S.DetailValue>
                      <S.NotificationBadge
                        $active={usuario.notificacoesAtivadas || false}
                      >
                        {usuario.notificacoesAtivadas ? "Ativas" : "Inativas"}
                      </S.NotificationBadge>
                    </S.DetailValue>
                  </S.UserDetail>
                  <S.UserDetail>
                    <S.DetailLabel>Status de Acesso:</S.DetailLabel>
                    <S.DetailValue>
                      <S.NotificationBadge
                        $active={usuario.autorizado || false}
                      >
                        {usuario.autorizado ? "Autorizado" : "Pendente"}
                      </S.NotificationBadge>
                    </S.DetailValue>
                  </S.UserDetail>
                  <S.UserDetail>
                    <S.DetailLabel>Última atividade:</S.DetailLabel>
                    <S.DetailValue>
                      {getTempoUltimaAtividade(usuario.ultimaAtividade)}
                    </S.DetailValue>
                  </S.UserDetail>
                </S.UserDetails>

                {isAdmin &&
                  usuario.id !== currentUser?.id &&
                  (usuario.autorizado === false ? (
                    <S.AuthorizeButton
                      onClick={(e) => handleToggleAutorizacao(e, usuario.id, true)}
                    >
                      <UserCheck size={18} /> Autorizar Acesso
                    </S.AuthorizeButton>
                  ) : (
                    <S.RevokeButton
                      onClick={(e) => handleToggleAutorizacao(e, usuario.id, false)}
                    >
                      <UserX size={18} /> Revogar Acesso
                    </S.RevokeButton>
                  ))}
              </S.UserCard>
            ))}
          </S.UsersGrid>
        ) : (
          <S.UsersList>
            {usuariosFiltrados.map((usuario) => (
              <S.UserListItem
                key={usuario.id}
                onClick={() => handleUserClick(usuario.id)}
                $autorizado={usuario.autorizado}
              >
                <S.ListItemContent>
                  <S.ListItemMain>
                    <S.UserAvatar>
                      {formatUtils.getInitials(usuario.nome)}
                    </S.UserAvatar>
                    <div>
                      <S.ListItemName>{usuario.nome}</S.ListItemName>
                      <S.ListItemRole>{usuario.funcao}</S.ListItemRole>
                    </div>
                  </S.ListItemMain>
                  <S.ListItemDetail>
                    <S.DetailLabel>Email:</S.DetailLabel>
                    <S.DetailValue>{usuario.email}</S.DetailValue>
                  </S.ListItemDetail>
                  <S.ListItemDetail>
                    <S.DetailLabel>Login:</S.DetailLabel>
                    <S.DetailValue>{usuario.login}</S.DetailValue>
                  </S.ListItemDetail>
                  <S.ListItemStatus
                    $online={isUserOnline(usuario.ultimaAtividade)}
                  >
                    <S.StatusDot
                      $online={isUserOnline(usuario.ultimaAtividade)}
                    />
                    {isUserOnline(usuario.ultimaAtividade)
                      ? "Online"
                      : "Offline"}
                  </S.ListItemStatus>
                  <S.ListItemNotification
                    $active={usuario.notificacoesAtivadas || false}
                  >
                    {usuario.notificacoesAtivadas ? "Ativas" : "Inativas"}
                  </S.ListItemNotification>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {isAdmin && usuario.id !== currentUser?.id ? (
                      usuario.autorizado === false ? (
                        <S.ListAuthorizeButton
                          onClick={(e) =>
                            handleToggleAutorizacao(e, usuario.id, true)
                          }
                        >
                          <UserCheck size={16} /> Autorizar
                        </S.ListAuthorizeButton>
                      ) : (
                        <S.ListRevokeButton
                          onClick={(e) =>
                            handleToggleAutorizacao(e, usuario.id, false)
                          }
                        >
                          <UserX size={16} /> Revogar
                        </S.ListRevokeButton>
                      )
                    ) : (
                      <S.ListItemNotification
                        $active={usuario.autorizado || false}
                      >
                        {usuario.autorizado ? "Autorizado" : "Pendente"}
                      </S.ListItemNotification>
                    )}
                  </div>
                </S.ListItemContent>
              </S.UserListItem>
            ))}
          </S.UsersList>
        )}
      </MainContent>
    </PageContainer>
  );
}
