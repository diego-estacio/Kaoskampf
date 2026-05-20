import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { Empresa } from "./empresa.entity";
import { Usuario } from "./usuario.entity";
import { Timeline } from "./timeline.entity";
import { Proposta } from "./proposta.entity";

export enum StatusContato {
  CADASTRO = 0,

  REUNIAO = 2,
  PROPOSTA = 3,
  ATENDIMENTO = 4,
  INATIVO = 5,
  REATIVADO = 6,
}

export enum LeadTemperatura {
  FRIO = "frio",
  MORNO = "morno",
  QUENTE = "quente",
  INATIVO = "inativo",
  FECHADO = "fechado",
}

export enum OrigemLead {
  INBOUND = "Inbound",
  OUTBOUND = "Outbound",
  INDICACAO = "Indicacao",
  EVENTO = "Evento",
  REDES_SOCIAIS = "RedesSociais",
  EMAIL_MARKETING = "EmailMarketing",
  TELEFONE = "Telefone",
  OUTROS = "Outros",
}

export enum Probabilidade {
  ALTA = "Alta",
  MEDIA = "Media",
  BAIXA = "Baixa",
}

export enum Urgencia {
  URGENTE = "Urgente",
  ALTA = "Alta",
  MEDIA = "Media",
  BAIXA = "Baixa",
}

export enum TipoContato {
  LEAD = "lead",
  CLIENTE = "cliente",
}

export interface ContatoInfo {
  telefone?: string;
  email?: string;
  linkedin?: string;
}

@Entity("contatos")
export class Contato {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100, nullable: true })
  cargo: string;

  @Column({ length: 100, nullable: true })
  areaDepartamento: string;

  @Column({ type: "boolean", default: false })
  eDecisor: boolean;

  @Column({
    type: "enum",
    enum: OrigemLead,
    nullable: true,
  })
  origem: OrigemLead;

  @Column({ type: "text", nullable: true })
  observacoes: string;

  @Column({ type: "text", nullable: true })
  dorPrincipal: string;

  @Column({ type: "json", nullable: true })
  contatos: ContatoInfo;

  @Column({
    type: "enum",
    enum: StatusContato,
    default: StatusContato.CADASTRO,
  })
  status: StatusContato;

  @Column({
    type: "enum",
    enum: Probabilidade,
    nullable: true,
  })
  probabilidade: Probabilidade;

  @Column({
    type: "enum",
    enum: Urgencia,
    nullable: true,
  })
  urgencia: Urgencia;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  valorEstimado: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  orcamentoEstimado: number;

  @Column({ type: "date", nullable: true })
  prazo: Date;

  @Column({
    type: "enum",
    enum: TipoContato,
    default: TipoContato.LEAD,
  })
  tipoContato: TipoContato;

  @Column({
    type: "enum",
    enum: LeadTemperatura,
    default: LeadTemperatura.MORNO,
  })
  lead: LeadTemperatura;

  @Column({ type: "int", default: 3 })
  diasProximoContato: number;

  @Column({ type: "int", default: 0 })
  numeroContatos: number;

  // ✅ NOVO: Sistema de 3 Perfis de Tentativas
  @Column({ type: "int", default: 1 })
  perfilAtual: number; // 1, 2 ou 3

  @Column({ type: "int", default: 0 })
  tentativasPerfil1: number; // 0-5

  @Column({ type: "int", default: 0 })
  tentativasPerfil2: number; // 0-5

  @Column({ type: "int", default: 0 })
  tentativasPerfil3: number; // 0-5

  // Múltiplos responsáveis pelo contato
  @ManyToMany(() => Usuario, (usuario) => usuario.contatosResponsavel)
  @JoinTable({
    name: "contatos_responsaveis_usuario",
    joinColumn: { name: "contatoId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "usuarioId", referencedColumnName: "id" },
  })
  responsaveis: Usuario[];

  @Column({ type: "datetime" })
  proximoContato: Date;

  @Column({ type: "datetime", nullable: true })
  ultimoContatoRealizado: Date;

  @ManyToOne(() => Empresa, (empresa) => empresa.contatos, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "empresaId" })
  empresa: Empresa;

  @Column({ type: "uuid" })
  empresaId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.contatos)
  @JoinColumn({ name: "usuarioCriadorId" })
  usuarioCriador: Usuario;

  @Column({ type: "uuid" })
  usuarioCriadorId: string;

  @OneToMany(() => Timeline, (timeline) => timeline.contato)
  atividades: Timeline[];

  @OneToMany(() => Proposta, (proposta) => proposta.contato)
  propostas: Proposta[];

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
