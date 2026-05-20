import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity("observacoes")
export class Observacao {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  texto: string;

  @Column({ type: "uuid" })
  contatoId: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "autorId" })
  autor: Usuario;

  @Column({ type: "uuid" })
  autorId: string;

  @CreateDateColumn()
  criadaEm: Date;
}
