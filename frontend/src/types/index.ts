// Tipos para as entidades do sistema

export enum TipoAtividade {
  CADASTRO = "cadastro",
  OBSERVACAO = "observacao",
  TENTATIVA_CONTATO = "tentativa_contato",
  REUNIAO = "reuniao",
  PROPOSTA = "proposta",
  ATUALIZACAO = "atualizacao",
}

export interface Timeline {
  id: string;
  atividade: string;
  descricao?: string;
  tipo: TipoAtividade;
  usuarioId: string;
  usuario?: Usuario;
  contatoId: string;
  contato?: Contato;
  criadoEm: string;
}

export type UsuarioRole = "MASTER" | "ADMIN" | "MEMBER";

export interface Usuario {
  id: string;
  login: string;
  nome: string;
  email: string;
  funcao: string; // cargo ou função de trabalho, não usado para permissão
  role?: UsuarioRole; // role de autorização (MASTER, ADMIN, MEMBER)
  notificacoes: {
    ativada: boolean;
    diasAntes: number;
  };
  autorizado: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Marca {
  id: number;
  name: string;
  slug: string;
  description?: string;
  colorArray?: string;
  logo?: string;
  icon?: string; // ID do ícone Lucide (ex: 'building-2', 'drama', 'camera')
  primaryColor?: string;
  email?: string;
  telefone?: string;
  website?: string;
}

export interface Empresa {
  id: string;
  nome: string;
  porte: "pequeno" | "medio" | "grande";
  site?: string;
  marcas?: Marca[];
  observacoes?: string;
  status: number;
  criadoEm: string;
  atualizadoEm: string;
  contatos?: Contato[];
}

export interface ContatoInfo {
  telefone?: string;
  email?: string;
  linkedin?: string;
}

export interface Contato {
  id: string;
  nome: string;
  cargo?: string;
  observacoes?: string;
  contatos?: ContatoInfo;
  status: StatusContato;
  lead: LeadTemperatura;
  tipoContato: "lead" | "cliente";
  diasProximoContato: number;
  proximoContato: string;
  numeroContatos: number;
  // ✅ NOVO: Sistema de 3 Perfis de Tentativas
  perfilAtual: number; // 1, 2 ou 3
  tentativasPerfil1: number; // 0-5
  tentativasPerfil2: number; // 0-5
  tentativasPerfil3: number; // 0-5
  empresaId: string;
  empresa?: Empresa;
  usuarioCriadorId: string;
  usuarioCriador?: Usuario;
  atividades?: Timeline[];
  criadoEm: string;
  atualizadoEm: string;
}

// Catálogo de serviços/produtos

export interface CatalogoItem {
  id: string;
  // Um item pode estar associado a várias marcas
  marcas?: Marca[];
  tipo: string;
  especificacoes: string;
  descricao?: string;
  precoG: number;
  precoM?: number;
  precoP?: number;
  valorAdicionalG?: number;
  valorAdicionalM?: number;
  valorAdicionalP?: number;
  unidadeAdicional?: string;
  inclui?: string;
  naoInclui?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export enum StatusContato {
  CADASTRADO = 0,
  REUNIAO = 1,
  PROPOSTA = 2,
  NEGOCIACAO = 3,
  FECHADO = 4,
  PERDIDO = 5,
}

export enum LeadTemperatura {
  FRIO = "frio",
  MORNO = "morno",
  QUENTE = "quente",
}

// Propostas comerciais

export type MoedaProposta = "BRL" | "USD" | "EUR";

export type StatusProposta =
  | "rascunho"
  | "enviada"
  | "visualizada"
  | "aprovada"
  | "recusada"
  | "expirada";

export type PricingTier = "G" | "M" | "P";

// Tipo de desconto usado tanto em itens quanto em desconto global
export type TipoDesconto = "valor" | "percentual";

// Constantes para uso seguro em comparações
export const TIPO_DESCONTO = {
  VALOR: "valor" as const,
  PERCENTUAL: "percentual" as const,
} as const;

// @deprecated Use TipoDesconto
export type TipoDescontoItem = TipoDesconto;

export interface PropostaItem {
  id: string;
  propostaId: string;
  itemCatalogoId?: string | null;
  nome: string;
  descricao?: string | null;
  inclui?: string | null;
  naoInclui?: string | null;
  quantidade: number;
  precoUnitario: number;
  tipoDesconto?: TipoDesconto | null;
  valorDesconto?: number | null;
  precoTotal: number;
  ordem: number;
}

export interface Proposta {
  id: string;
  numero: string;
  titulo: string;
  introducao?: string | null;
  moeda: MoedaProposta;
  status: StatusProposta;
  valorTotal: number;
  tipoDescontoGlobal?: TipoDesconto | null;
  valorDescontoGlobal?: number | null;
  empresaId: string;
  empresa?: Empresa;
  contatoId: string;
  contato?: Contato;
  usuarioCriadorId: string;
  usuarioCriador?: Usuario;
  marcaId?: number | null;
  marca?: Marca;
  itens?: PropostaItem[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface PropostaItemInput {
  itemCatalogoId?: string | null;
  nome?: string;
  descricao?: string;
  inclui?: string;
  naoInclui?: string;
  quantidade: number;
  precoUnitario?: number;
  tipoDesconto?: TipoDesconto | null;
  valorDesconto?: number | null;
  pricingTier?: PricingTier | null;
}

export interface CriarPropostaData {
  contatoId: string;
  marcaId?: number | null;
  titulo: string;
  introducao?: string;
  moeda?: MoedaProposta;
  tipoDescontoGlobal?: TipoDesconto | null;
  valorDescontoGlobal?: number | null;
  itens: PropostaItemInput[];
}

export interface AtualizarPropostaData {
  titulo?: string;
  introducao?: string;
  status?: StatusProposta;
  moeda?: MoedaProposta;
  tipoDescontoGlobal?: TipoDesconto | null;
  valorDescontoGlobal?: number | null;
  itens?: PropostaItemInput[];
}

export interface CriarCatalogoItemData {
  marcaIds?: number[];
  marcaId?: number; // compatibilidade, se for enviado apenas um id
  tipo: string;
  especificacoes: string;
  descricao?: string;
  precoG: number;
  precoM?: number;
  precoP?: number;
  valorAdicionalG?: number;
  valorAdicionalM?: number;
  valorAdicionalP?: number;
  unidadeAdicional?: string;
  inclui?: string;
  naoInclui?: string;
  ativo?: boolean;
}

export type AtualizarCatalogoItemData = Partial<CriarCatalogoItemData>;

export interface Timeline {
  id: string;
  atividade: string;
  descricao?: string;
  usuarioId: string;
  usuario?: Usuario;
  contatoId: string;
  contato?: Contato;
  criadoEm: string;
}

// Tipos para formulários e DTOs

export interface LoginData {
  login: string;
  senha: string;
}

export interface CadastroData {
  login: string;
  nome: string;
  senha: string;
  email: string;
  funcao: string;
  notificacoes?: {
    ativada: boolean;
    diasAntes: number;
  };
}

export interface CriarEmpresaData {
  nome: string;
  porte?: "pequeno" | "medio" | "grande";
  site?: string;
  marcaIds?: number[]; // IDs das marcas selecionadas
  observacoes?: string;
}

export interface AtualizarEmpresaData {
  nome?: string;
  porte?: "pequeno" | "medio" | "grande";
  site?: string;
  marcaIds?: number[];
  observacoes?: string;
}

export interface CriarContatoData {
  nome: string;
  cargo?: string;
  observacoes?: string;
  contatos?: ContatoInfo;
  lead?: LeadTemperatura;
  tipoContato?: "lead" | "cliente";
  empresaId?: string;
  novaEmpresa?: CriarEmpresaData;
}

export interface AtualizarContatoData {
  nome?: string;
  cargo?: string;
  observacoes?: string;
  contatos?: ContatoInfo;
  status?: StatusContato;
  lead?: LeadTemperatura;
  diasProximoContato?: number;
  tipoContato?: "lead" | "cliente";
  empresaId?: string;
}

// Tipos para respostas da API

export interface AuthResponse {
  access_token: string;
  usuario: Usuario;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Tipos para filtros

export interface FiltrosContato {
  nome?: string;
  empresaId?: string;
  status?: StatusContato[];
  lead?: LeadTemperatura[];
}

// Tipos para notificações

export interface Notificacao {
  id: string;
  tipo: "contato" | "sistema";
  titulo: string;
  mensagem: string;
  contato?: Contato;
  lida: boolean;
  criadoEm: string;
}

// Tipos para componentes

export interface Tab {
  id: string;
  label: string;
  icon?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

// Tipos para Kanban

export interface KanbanColumn {
  id: string;
  title: string;
  status: number;
  items: KanbanItem[];
}

export interface KanbanItem {
  id: string;
  nome: string;
  status: number;
  contatos: number;
  ultimoContato: number;
}

export interface Observacao {
  id: string;
  texto: string;
  criadaEm: string;
  contatoId: string;
  autorId: string;
  autor?: Usuario;
}

export interface NotificacaoContato {
  id: string;
  tipo: "urgente" | "aviso";
  titulo: string;
  mensagem: string;
  contato: {
    id: string;
    nome: string;
    empresa: string;
  };
  dataLimite: string;
}
