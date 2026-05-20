"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdNotifications, MdClose } from "react-icons/md";
import { Bell, Clock, AlertTriangle } from "lucide-react";
import {
  NotificationBell as NotificationBellContainer,
  BellIcon,
  NotificationBadge,
  NotificationDropdown,
  NotificationHeader,
  NotificationItem,
  NotificationTitle,
  NotificationMessage,
  NotificationTime,
  NoNotifications,
  DeleteNotificationButton,
} from "./Layout.styles";
import { useNotificacoes } from "../../hooks/useNotificacoes";
import { formatDate, getResumoDia } from "../../utils/dateUtils";

export default function NotificationBell() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  // Helpers para lidar com diferentes formatos de notificação vindos da API
  const getContatoIdFromNotification = (notification: any): string => {
    return (
      notification?.contato?.id ||
      notification?.contatoId ||
      notification?.id ||
      ""
    );
  };

  const getMensagemFromNotification = (notification: any): string => {
    return notification?.mensagem || notification?.descricao || "";
  };

  const getDataLimiteFromNotification = (
    notification: any,
  ): string | Date | null => {
    return notification?.dataLimite || notification?.dataLimiteContato || null;
  };

  const getContatoNomeFromNotification = (notification: any): string | null => {
    return notification?.contato?.nome || null;
  };

  const getContatoEmpresaFromNotification = (
    notification: any,
  ): string | null => {
    return notification?.contato?.empresa || null;
  };

  // Hook customizado para notificações
  const {
    notificacoes,
    notificacoesCount,
    loadNotificacoes,
    deletarNotificacao,
    marcarComoVisualizada,
    startPolling,
    stopPolling,
  } = useNotificacoes();

  useEffect(() => {
    // Inicia polling do contador a cada 5 minutos
    startPolling(300000);

    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  // Fechar notificações ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-notification-bell]")) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleDeleteNotification = async (
    e: React.MouseEvent,
    notificacaoId: string,
  ) => {
    e.stopPropagation(); // Evita abrir o contato ao deletar
    try {
      await deletarNotificacao(notificacaoId);
    } catch (error) {
      console.error("❌ Erro ao deletar notificação:", error);
    }
  };

  const handleNotificationClick = async (
    contatoId: string,
    notificacaoId: string,
  ) => {
    await marcarComoVisualizada(notificacaoId);
    router.push(`/contatos/${contatoId}`);
    setShowNotifications(false);
  };

  const handleToggleNotifications = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);

    // Busca notificações completas apenas quando ABRE o dropdown
    if (newState && notificacoesCount > 0) {
      await loadNotificacoes();
    }
  };

  return (
    <NotificationBellContainer
      data-notification-bell
      onClick={handleToggleNotifications}
    >
      <BellIcon $hasNotifications={notificacoesCount > 0}>
        <MdNotifications />
      </BellIcon>
      {notificacoesCount > 0 && (
        <NotificationBadge>
          {notificacoesCount > 9 ? "9+" : notificacoesCount}
        </NotificationBadge>
      )}

      <NotificationDropdown $show={showNotifications}>
        <NotificationHeader>
          Notificações ({notificacoesCount})
        </NotificationHeader>

        {notificacoes.length === 0 ? (
          <NoNotifications>Nenhuma notificação pendente</NoNotifications>
        ) : (
          notificacoes.map((notificacao) => (
            <NotificationItem
              key={notificacao.id}
              $urgent={notificacao.tipo === "urgente"}
              onClick={() =>
                handleNotificationClick(
                  getContatoIdFromNotification(notificacao),
                  notificacao.id,
                )
              }
            >
              <DeleteNotificationButton
                onClick={(e) => handleDeleteNotification(e, notificacao.id)}
                title="Deletar notificação"
              >
                <MdClose />
              </DeleteNotificationButton>

              {/* Ícone baseado no tipo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                {notificacao.tipo === "urgente" ? (
                  <Bell size={16} color="#ff6b6b" />
                ) : notificacao.titulo.includes("Inativado") ? (
                  <AlertTriangle size={16} color="#ffa000" />
                ) : (
                  <Clock size={16} color="#4dabf7" />
                )}
                <NotificationTitle>
                  {getContatoNomeFromNotification(notificacao) ||
                    notificacao.titulo}
                  {getContatoEmpresaFromNotification(notificacao) &&
                    ` – ${getContatoEmpresaFromNotification(notificacao)}`}
                </NotificationTitle>
              </div>

              {getResumoDia(getDataLimiteFromNotification(notificacao)) && (
                <NotificationMessage>
                  {getResumoDia(getDataLimiteFromNotification(notificacao))}
                </NotificationMessage>
              )}

              <NotificationTime>
                {getDataLimiteFromNotification(notificacao)
                  ? `Compromisso: ${formatDate(
                      getDataLimiteFromNotification(notificacao),
                    )}`
                  : getMensagemFromNotification(notificacao)}
              </NotificationTime>
            </NotificationItem>
          ))
        )}
      </NotificationDropdown>
    </NotificationBellContainer>
  );
}
