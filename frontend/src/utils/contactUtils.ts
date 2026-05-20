/**
 * Utilitários centralizados para operações com contatos
 * Evita duplicação de código entre páginas
 */

import { Contato } from "../types";

/**
 * Converte número da tentativa para texto extenso
 * @param num Número da tentativa (1, 2, 3...)
 * @returns Texto extenso ("Primeiro", "Segundo", etc.)
 */
export const getNumeroExtenso = (num: number): string => {
  const numeros = [
    "Primeiro",
    "Segundo",
    "Terceiro",
    "Quarto",
    "Quinto",
    "Sexto",
    "Sétimo",
    "Oitavo",
    "Nono",
    "Décimo",
  ];
  return numeros[num - 1] || `${num}º`;
};

/**
 * Labels para os diferentes canais de contato
 */
export const viaLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  linkedin: "LinkedIn",
  telefone: "Telefone",
  presencial: "Presencial",
};

/**
 * Utilitários para Sistema de 3 Perfis
 * ===================================
 */

/**
 * Calcula qual perfil está ativo baseado nas tentativas
 * @param contato Objeto do contato com campos de perfil
 * @returns Perfil ativo (1, 2 ou 3)
 */
export const calcularPerfilAtivo = (contato: Contato): number => {
  if (contato.perfilAtual) {
    return contato.perfilAtual;
  }

  // Fallback para contratos antigos - calcular baseado em numeroContatos
  if (contato.numeroContatos <= 5) return 1;
  if (contato.numeroContatos <= 10) return 2;
  return 3;
};

/**
 * Calcula quantas tentativas foram feitas no perfil atual
 * @param contato Objeto do contato
 * @param perfil Número do perfil (1, 2 ou 3)
 * @returns Número de tentativas no perfil especificado
 */
export const calcularTentativasPerfil = (
  contato: Contato,
  perfil: number
): number => {
  switch (perfil) {
    case 1:
      return contato.tentativasPerfil1 || 0;
    case 2:
      return contato.tentativasPerfil2 || 0;
    case 3:
      return contato.tentativasPerfil3 || 0;
    default:
      return 0;
  }
};

/**
 * Calcula a tentativa atual dentro do perfil ativo
 * @param contato Objeto do contato
 * @returns Tentativa atual (1-5) dentro do perfil
 */
export const calcularTentativaAtual = (contato: Contato): number => {
  const perfilAtivo = calcularPerfilAtivo(contato);
  return calcularTentativasPerfil(contato, perfilAtivo);
};

/**
 * Formata o label do perfil para exibição
 * @param perfil Número do perfil (1, 2 ou 3)
 * @returns Label formatado ("Perfil 1", "Perfil 2", etc.)
 */
export const formatarPerfilLabel = (perfil: number): string => {
  return `Perfil ${perfil}`;
};

/**
 * Verifica se um perfil foi completado (5 tentativas)
 * @param contato Objeto do contato
 * @param perfil Número do perfil (1, 2 ou 3)
 * @returns true se o perfil foi completado
 */
export const isPerfilCompleto = (contato: Contato, perfil: number): boolean => {
  return calcularTentativasPerfil(contato, perfil) >= 5;
};

/**
 * Calcula o status visual do perfil (ativo, concluido, aguardando)
 * @param contato Objeto do contato
 * @param perfil Número do perfil (1, 2 ou 3)
 * @returns Status: 'ativo' | 'concluido' | 'aguardando'
 */
export const getStatusPerfil = (
  contato: Contato,
  perfil: number
): "ativo" | "concluido" | "aguardando" => {
  const perfilAtivo = calcularPerfilAtivo(contato);

  if (perfil < perfilAtivo) return "concluido";
  if (perfil === perfilAtivo) return "ativo";
  return "aguardando";
};

/**
 * Calcula total de tentativas realizadas em todos os perfis
 * @param contato Objeto do contato
 * @returns Total de tentativas (0-15)
 */
export const calcularTotalTentativas = (contato: Contato): number => {
  const tentativas1 = calcularTentativasPerfil(contato, 1);
  const tentativas2 = calcularTentativasPerfil(contato, 2);
  const tentativas3 = calcularTentativasPerfil(contato, 3);
  return tentativas1 + tentativas2 + tentativas3;
};

/**
 * Formata observação padronizada para tentativas de contato
 * @param numeroTentativa Número da tentativa
 * @param via Canal utilizado (whatsapp, email, etc.)
 * @param observacao Texto da observação
 * @returns Texto formatado da observação
 */
export const formatarObservacaoContato = (
  numeroTentativa: number,
  via: string,
  observacao: string
): string => {
  return `${getNumeroExtenso(numeroTentativa)} contato realizado via ${
    viaLabels[via] || via
  }. Observação: ${observacao}`;
};

/**
 * Calcula o número da próxima tentativa baseado no numeroContatos atual
 * @param numeroContatos Número atual de contatos realizados
 * @returns Número da próxima tentativa
 */
export const calcularProximaTentativa = (
  numeroContatos: number = 0
): number => {
  return numeroContatos + 1;
};

/**
 * Verifica se o contato atingiu o limite máximo de tentativas
 * @param numeroContatos Número atual de contatos realizados
 * @param limite Limite máximo (padrão: 5)
 * @returns true se atingiu o limite
 */
export const atingiuLimiteTentativas = (
  numeroContatos: number = 0,
  limite: number = 5
): boolean => {
  return numeroContatos >= limite;
};

/**
 * Calcula dias até próximo contato
 * @param proximoContatoString Data do próximo contato em formato ISO
 * @returns String descritiva dos dias restantes
 */
export const calcularDiasProximoContato = (
  proximoContatoString: string
): string => {
  if (!proximoContatoString) return "Não definido";

  const proximoContato = new Date(proximoContatoString);
  const agora = new Date();

  // Definir hora para 00:00:00 para comparação apenas de datas
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const dataProximo = new Date(
    proximoContato.getFullYear(),
    proximoContato.getMonth(),
    proximoContato.getDate()
  );

  const diffMs = dataProximo.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return "Atrasado";
  if (diffDias === 0) return "Hoje";
  if (diffDias === 1) return "Amanhã";
  return `em ${diffDias} dias`;
};
