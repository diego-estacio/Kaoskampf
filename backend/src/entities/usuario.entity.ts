import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { UsuarioRole } from "../auth/roles.decorator";
import { Contato } from "./contato.entity";
import { Timeline } from "./timeline.entity";
import { Proposta } from "./proposta.entity";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, length: 50 })
  login: string;

  @Column({ length: 100 })
  nome: string;

  @Column()
  senha: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 50 })
  funcao: string;

  // Role de autorização (MASTER, ADMIN, MEMBER)
  @Column({
    type: "enum",
    enum: ["MASTER", "ADMIN", "MEMBER"],
    default: "MEMBER",
  })
  role: UsuarioRole;

  // Autorização de acesso (MASTER/ADMIN aprovam novos usuários)
  @Column({ default: false })
  autorizado: boolean;

  // Configurações de notificação
  @Column({ default: true })
  notificacoesAtivadas: boolean;

  @Column({ default: 1 })
  diasAntesNotificacao: number;

  @OneToMany(() => Contato, (contato) => contato.usuarioCriador)
  contatos: Contato[];

  @ManyToMany(() => Contato, (contato) => contato.responsaveis)
  contatosResponsavel: Contato[];

  @OneToMany(() => Timeline, (timeline) => timeline.usuario)
  atividades: Timeline[];

  @OneToMany(() => Proposta, (proposta) => proposta.usuarioCriador)
  propostasCriadas: Proposta[];

  @CreateDateColumn()
  criadoEm: Date;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ type: "timestamp", nullable: true })
  resetPasswordExpires: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

}
