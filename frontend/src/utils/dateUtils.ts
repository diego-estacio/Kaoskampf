/**
 * Utilitários centralizados para operações com datas usando Day.js
 * Padroniza formatação e cálculos de data/hora com detecção automática de timezone
 */

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

// Configurar plugins do Day.js
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("pt-br");

/**
 * Obtém timezone do usuário automaticamente ou usa Brasília como padrão
 */
export const getUserTimezone = (): string => {
  try {
    return dayjs.tz.guess() || "America/Sao_Paulo";
  } catch {
    return "America/Sao_Paulo";
  }
};

/**
 * Obtém data/hora atual no timezone do usuário
 * @returns Data ajustada para timezone local do navegador
 */
export const getBrasilTimezone = (): Date => {
  const userTz = getUserTimezone();
  return dayjs().tz(userTz).toDate();
};

/**
 * Formata data no padrão brasileiro (DD/MM/AAAA) no timezone do usuário
 * @param dateString String da data no formato ISO, DATE do MySQL, ou Date object
 * @returns Data formatada em pt-BR
 */
export const formatDate = (
  dateString: string | Date | null | undefined,
): string => {
  if (!dateString) return "Data não disponível";

  try {
    const userTz = getUserTimezone();
    // Interpretar como UTC vindo do backend e converter para o timezone do usuário
    return dayjs.utc(dateString).tz(userTz).format("DD/MM/YYYY");
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
};

/**
 * Formata data e hora no padrão brasileiro com timezone do usuário
 * @param dateString String da data no formato ISO, DATE do MySQL, ou Date object
 * @returns Data e hora formatadas em pt-BR
 */
export const formatDateTime = (
  dateString: string | Date | null | undefined,
): string => {
  if (!dateString) return "Data não disponível";

  try {
    const userTz = getUserTimezone();
    // Interpretar como UTC vindo do backend e converter para o timezone do usuário
    return dayjs.utc(dateString).tz(userTz).format("DD/MM/YYYY HH:mm");
  } catch (error) {
    console.error("Erro ao formatar data/hora:", error);
    return "Data inválida";
  }
};

/**
 * Calcula diferença em dias entre duas datas
 * @param dataInicio Data inicial
 * @param dataFim Data final (padrão: hoje)
 * @returns Número de dias de diferença
 */
export const calcularDiasEntre = (
  dataInicio: string | Date,
  dataFim: string | Date = new Date(),
): number => {
  const inicio =
    typeof dataInicio === "string" ? new Date(dataInicio) : dataInicio;
  const fim = typeof dataFim === "string" ? new Date(dataFim) : dataFim;

  const diffMs = fim.getTime() - inicio.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Verifica se uma data é hoje
 * @param dateString String da data no formato ISO
 * @returns true se a data for hoje
 */
export const isToday = (dateString: string): boolean => {
  if (!dateString) return false;

  const data = new Date(dateString);
  const hoje = new Date();

  return (
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()
  );
};

/**
 * Adiciona dias a uma data
 * @param data Data base
 * @param dias Número de dias para adicionar
 * @returns Nova data com os dias adicionados
 */
export const adicionarDias = (data: Date, dias: number): Date => {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + dias);
  return novaData;
};

/**
 * Formata data em tempo relativo ("há X minutos", "há X horas", etc)
 * @param dateString String da data no formato ISO
 * @returns Tempo relativo em pt-BR
 */
export const formatRelativeTime = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) return "Data não disponível";

  try {
    const userTz = getUserTimezone();
    // Backend/DB estão em UTC: interpretar como UTC e converter para timezone do usuário
    return dayjs.utc(dateString).tz(userTz).fromNow();
  } catch (error) {
    console.error("Erro ao formatar tempo relativo:", error);
    return "Data inválida";
  }
};

/**
 * Gera um resumo em texto sobre o dia de um compromisso
 * Ex.: "Entrar em contato HOJE", "Entrar em contato AMANHÃ",
 * "Entrar em contato em 3 dias", "Atrasado há 2 dias".
 */
export const getResumoDia = (
  date: string | Date | null | undefined,
): string | null => {
  if (!date) return null;

  try {
    const userTz = getUserTimezone();
    const hoje = dayjs().tz(userTz).startOf("day");
    const compromisso = dayjs(date).tz(userTz).startOf("day");

    const diffDias = compromisso.diff(hoje, "day");

    if (diffDias === 0) return "Entrar em contato HOJE";
    if (diffDias === 1) return "Entrar em contato AMANHÃ";
    if (diffDias > 1) return `Entrar em contato em ${diffDias} dias`;

    const diasAtrasados = Math.abs(diffDias);
    if (diasAtrasados === 1) return "Atrasado há 1 dia";
    return `Atrasado há ${diasAtrasados} dias`;
  } catch (error) {
    console.error("Erro ao calcular resumo do dia:", error);
    return null;
  }
};
