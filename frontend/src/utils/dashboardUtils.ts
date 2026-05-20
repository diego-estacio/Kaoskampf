import { Contato, Empresa, Timeline, TipoAtividade } from "../types";

/**
 * Calcula estatísticas de contatos
 */
export const calcularStatsContatos = (contatos: Contato[]) => {
  const agora = new Date();
  const seteDiasAtras = new Date(agora);
  seteDiasAtras.setDate(agora.getDate() - 7);

  const quatorzeDiasAtras = new Date(agora);
  quatorzeDiasAtras.setDate(agora.getDate() - 14);

  // Contatos cadastrados na última semana (últimos 7 dias)
  const contatosSemanaAtual = contatos.filter((contato) => {
    const dataCriacao = new Date(contato.criadoEm);
    return dataCriacao >= seteDiasAtras;
  }).length;

  // Contatos cadastrados na semana anterior (8-14 dias atrás)
  const contatosSemanaAnterior = contatos.filter((contato) => {
    const dataCriacao = new Date(contato.criadoEm);
    return dataCriacao >= quatorzeDiasAtras && dataCriacao < seteDiasAtras;
  }).length;

  // Calcular porcentagem de crescimento
  let porcentagem = 0;
  if (contatosSemanaAnterior > 0) {
    porcentagem =
      ((contatosSemanaAtual - contatosSemanaAnterior) /
        contatosSemanaAnterior) *
      100;
  } else if (contatosSemanaAtual > 0) {
    porcentagem = 100; // Se não tinha contatos na semana anterior e agora tem, é 100% de crescimento
  }

  return {
    total: contatos.length,
    semanaAtual: contatosSemanaAtual,
    porcentagem: Math.round(porcentagem),
  };
};

/**
 * Calcula estatísticas de empresas
 */
export const calcularStatsEmpresas = (empresas: Empresa[]) => {
  const agora = new Date();
  const seteDiasAtras = new Date(agora);
  seteDiasAtras.setDate(agora.getDate() - 7);

  const quatorzeDiasAtras = new Date(agora);
  quatorzeDiasAtras.setDate(agora.getDate() - 14);

  // Empresas cadastradas na última semana
  const empresasSemanaAtual = empresas.filter((empresa) => {
    const dataCriacao = new Date(empresa.criadoEm);
    return dataCriacao >= seteDiasAtras;
  }).length;

  // Empresas cadastradas na semana anterior
  const empresasSemanaAnterior = empresas.filter((empresa) => {
    const dataCriacao = new Date(empresa.criadoEm);
    return dataCriacao >= quatorzeDiasAtras && dataCriacao < seteDiasAtras;
  }).length;

  // Calcular porcentagem de crescimento
  let porcentagem = 0;
  if (empresasSemanaAnterior > 0) {
    porcentagem =
      ((empresasSemanaAtual - empresasSemanaAnterior) /
        empresasSemanaAnterior) *
      100;
  } else if (empresasSemanaAtual > 0) {
    porcentagem = 100;
  }

  return {
    total: empresas.length,
    semanaAtual: empresasSemanaAtual,
    porcentagem: Math.round(porcentagem),
  };
};

/**
 * Calcula atividades de hoje
 */
export const calcularAtividadesHoje = (timeline: Timeline[]) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const atividadesHoje = timeline.filter((atividade) => {
    const dataAtividade = new Date(atividade.criadoEm);
    dataAtividade.setHours(0, 0, 0, 0);
    return dataAtividade.getTime() === hoje.getTime();
  });

  // Contar por tipo
  const tentativasContato = atividadesHoje.filter(
    (a) => a.tipo === TipoAtividade.TENTATIVA_CONTATO,
  ).length;

  const cadastros = atividadesHoje.filter(
    (a) => a.tipo === TipoAtividade.CADASTRO,
  ).length;

  const reunioes = atividadesHoje.filter(
    (a) => a.tipo === TipoAtividade.REUNIAO,
  ).length;

  const total = tentativasContato + cadastros + reunioes;
  const meta = 20;
  const porcentagemMeta = Math.round((total / meta) * 100);

  return {
    total,
    tentativasContato,
    cadastros,
    reunioes,
    meta,
    porcentagemMeta,
  };
};

/**
 * Formata porcentagem com sinal + ou -
 */
export const formatarPorcentagem = (porcentagem: number): string => {
  const sinal = porcentagem > 0 ? "+" : "";
  return `${sinal}${porcentagem}%`;
};

/**
 * Retorna cor baseada na porcentagem (positivo = verde, negativo = vermelho)
 */
export const getCorPorcentagem = (porcentagem: number): string => {
  return porcentagem >= 0 ? "#10b981" : "#ef4444";
};
