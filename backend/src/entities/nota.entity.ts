import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Usuario } from "./usuario.entity";

export enum CategoriaNota {
  CADASTRO = 0,
  REUNIAO = 2,
  PROPOSTA = 3,
  ATENDIMENTO = 4,
  INATIVO = 5,
  REATIVADO = 6,
}

@Entity("notas")
export class Nota {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, default: "Nova Nota" })
  titulo: string;

  @Column({ type: "text" })
  texto: string;

  @Column({
    type: "enum",
    enum: CategoriaNota,
    default: CategoriaNota.ATENDIMENTO,
  })
  categoria: CategoriaNota;

  @ManyToOne(() => Usuario, { onDelete: "CASCADE" })
  @JoinColumn({ name: "autorId" })
  autor: Usuario;

  @Column({ type: "uuid" })
  autorId: string;

  @CreateDateColumn()
  criadaEm: Date;

  @UpdateDateColumn()
  atualizadaEm: Date;
}
