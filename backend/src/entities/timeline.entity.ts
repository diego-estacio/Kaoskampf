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

export enum TipoAtividade {
  CADASTRO = "cadastro",
  OBSERVACAO = "observacao",
  TENTATIVA_CONTATO = "tentativa_contato",
  REUNIAO = "reuniao",
  PROPOSTA = "proposta",
  ATUALIZACAO = "atualizacao",
}

@Entity("timeline")
export class Timeline {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  atividade: string;

  @Column({ type: "text", nullable: true })
  descricao: string;

  @Column({
    type: "enum",
    enum: TipoAtividade,
    default: TipoAtividade.ATUALIZACAO,
  })
  tipo: TipoAtividade;

  @ManyToOne(() => Usuario, (usuario) => usuario.atividades)
  @JoinColumn({ name: "usuarioId" })
  usuario: Usuario;

  @Column({ type: "uuid" })
  usuarioId: string;

  @ManyToOne(() => Contato, (contato) => contato.atividades, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "contatoId" })
  contato: Contato;

  @Column({ type: "uuid" })
  contatoId: string;

  @CreateDateColumn()
  criadoEm: Date;
}
