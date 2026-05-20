import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Empresa } from "./empresa.entity";
import { Contato } from "./contato.entity";
import { Usuario } from "./usuario.entity";
import { Marca } from "./marca.entity";
import { PropostaItem } from "./proposta-item.entity";
import { TipoDesconto } from "./enums";

export enum StatusProposta {
  RASCUNHO = "rascunho",
  ENVIADA = "enviada",
  VISUALIZADA = "visualizada",
  APROVADA = "aprovada",
  RECUSADA = "recusada",
  EXPIRADA = "expirada",
}

export type MoedaProposta = "BRL" | "USD" | "EUR";

@Entity("propostas")
export class Proposta {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50 })
  numero: string;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: "text", nullable: true })
  introducao: string;

  @Column({ type: "varchar", length: 3, default: "BRL" })
  moeda: MoedaProposta;

  @Column({
    type: "enum",
    enum: StatusProposta,
    default: StatusProposta.RASCUNHO,
  })
  status: StatusProposta;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  valorTotal: number;

  // Desconto global aplicado sobre o total de todos os itens
  @Column({ type: "enum", enum: TipoDesconto, nullable: true })
  tipoDescontoGlobal: TipoDesconto | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  valorDescontoGlobal: number | null;

  @ManyToOne(() => Empresa, (empresa) => empresa.propostas, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "empresaId" })
  empresa: Empresa;

  @Column({ type: "uuid" })
  empresaId: string;

  @ManyToOne(() => Contato, (contato) => contato.propostas, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "contatoId" })
  contato: Contato;

  @Column({ type: "uuid" })
  contatoId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.propostasCriadas)
  @JoinColumn({ name: "usuarioCriadorId" })
  usuarioCriador: Usuario;

  @Column({ type: "uuid" })
  usuarioCriadorId: string;

  @ManyToOne(() => Marca, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "marcaId" })
  marca: Marca;

  @Column({ type: "int", nullable: true })
  marcaId: number | null;

  @OneToMany(() => PropostaItem, (item) => item.proposta, {
    cascade: true,
  })
  itens: PropostaItem[];

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
