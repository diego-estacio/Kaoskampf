import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { Contato } from "./contato.entity";
import { KanbanColuna } from "./kanban-coluna.entity";
import { Marca } from "./marca.entity";
import { CatalogoItem } from "./catalogo-item.entity";
import { Proposta } from "./proposta.entity";

export enum PorteEmpresa {
  PEQUENO = "pequeno",
  MEDIO = "medio",
  GRANDE = "grande",
}

export enum SegmentoMercado {
  TECNOLOGIA = "Tecnologia",
  VAREJO = "Varejo",
  SERVICOS = "Servicos",
  INDUSTRIA = "Industria",
  SAUDE = "Saude",
  EDUCACAO = "Educacao",
  FINANCEIRO = "Financeiro",
  ENTRETENIMENTO = "Entretenimento",
  ALIMENTACAO = "Alimentacao",
  CONSTRUCAO = "Construcao",
  OUTROS = "Outros",
}

@Entity("empresas")
export class Empresa {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 150 })
  nome: string;

  @Column({ length: 255, nullable: true })
  razaoSocial: string;

  @Column({ length: 18, nullable: true, unique: true })
  cnpj: string;

  @Column({ length: 50, nullable: true })
  inscricaoEstadual: string;

  @Column({
    type: "enum",
    enum: PorteEmpresa,
    default: PorteEmpresa.PEQUENO,
  })
  porte: PorteEmpresa;

  @Column({
    type: "enum",
    enum: SegmentoMercado,
    nullable: true,
  })
  segmento: SegmentoMercado;

  @Column({ length: 255, nullable: true })
  site: string;

  @Column({ length: 20, nullable: true })
  telefoneGeral: string;

  @Column({ type: "json", nullable: true })
  redesSociais: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };

  // Endereço
  @Column({ length: 9, nullable: true })
  enderecoCep: string;

  @Column({ length: 255, nullable: true })
  enderecoRua: string;

  @Column({ length: 20, nullable: true })
  enderecoNumero: string;

  @Column({ length: 100, nullable: true })
  enderecoComplemento: string;

  @Column({ length: 100, nullable: true })
  enderecoBairro: string;

  @Column({ length: 100, nullable: true })
  enderecoCidade: string;

  @Column({ length: 2, nullable: true })
  enderecoEstado: string;

  @Column({ type: "text", nullable: true })
  observacoes: string;

  @OneToMany(() => Contato, (contato) => contato.empresa)
  contatos: Contato[];

  @OneToMany(() => Proposta, (proposta) => proposta.empresa)
  propostas: Proposta[];

  // Relacionamento ManyToMany com Marcas
  @ManyToMany(() => Marca, (marca) => marca.empresas)
  @JoinTable({
    name: "empresas_marcas_marca",
    joinColumn: { name: "empresaId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "marcaId", referencedColumnName: "id" },
  })
  marcas: Marca[];

  // Relacionamento com coluna do Kanban
  @ManyToOne(() => KanbanColuna)
  @JoinColumn({ name: "kanbanColunaId" })
  kanbanColuna: KanbanColuna;

  @Column({ type: "uuid", nullable: true })
  kanbanColunaId: string;

  @Column({ type: "int", default: 0 })
  posicaoKanban: number; // Posição dentro da coluna

  @Column({ type: "int", default: 0 })
  status: number; // Status baseado no contato mais avançado

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
