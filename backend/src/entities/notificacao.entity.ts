import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Usuario } from "./usuario.entity";
import { Contato } from "./contato.entity";

@Entity("notificacoes")
export class Notificacao {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  usuarioId: string;

  @Column()
  contatoId: string;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: "text", nullable: true })
  descricao: string;

  @Column({ type: "date" })
  dataLimiteContato: Date;

  @Column({ default: false })
  visualizada: boolean;

  @Column({ default: false })
  contatoRealizado: boolean;

  @Column({ type: "datetime", nullable: true })
  dataContatoRealizado: Date;

  @CreateDateColumn()
  criadaEm: Date;

  // Relacionamentos
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "usuarioId" })
  usuario: Usuario;

  @ManyToOne(() => Contato)
  @JoinColumn({ name: "contatoId" })
  contato: Contato;
}
