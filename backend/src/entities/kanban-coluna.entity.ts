import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("kanban_colunas")
export class KanbanColuna {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ type: "int" })
  ordem: number;

  @Column({ length: 7, default: "#3b82f6" })
  cor: string;

  @Column({ default: true })
  ativa: boolean;

  @Column({ default: false })
  editavel: boolean; // false para colunas padrão do sistema

  @CreateDateColumn()
  criadaEm: Date;

  @UpdateDateColumn()
  atualizadaEm: Date;
}
