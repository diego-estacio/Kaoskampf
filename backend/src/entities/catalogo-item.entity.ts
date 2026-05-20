import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from "typeorm";
import { Marca } from "./marca.entity";
import { PropostaItem } from "./proposta-item.entity";

@Entity("catalogo_itens")
export class CatalogoItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => Marca, (marca) => marca.catalogoItens)
  @JoinTable({
    name: "marcas_catalogo_itens",
    joinColumn: { name: "catalogoItemId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "marcaId", referencedColumnName: "id" },
  })
  marcas: Marca[];

  // Tipo do serviço/produto (ex.: "Vídeo aula")
  @Column({ length: 150 })
  tipo: string;

  // Especificações do tipo (ex.: "até 5 minutos com ator")
  @Column({ type: "varchar", length: 255 })
  especificacoes: string;

  @Column({ type: "text", nullable: true })
  descricao: string;

  // Preço G (tabela cheia)
  @Column({ type: "decimal", precision: 10, scale: 2 })
  precoG: number;

  // Preço M (~50% do G)
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  precoM: number;

  // Preço P (~40% do G)
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  precoP: number;

  // Valor adicional por unidade (ex.: por minuto extra, por lâmina, por tela)
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  valorAdicionalG: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  valorAdicionalM: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  valorAdicionalP: number;

  // Tipo da unidade adicional (ex.: "Minutagem extra", "Lâmina unitária", "Valor por tela")
  @Column({ type: "varchar", length: 100, nullable: true })
  unidadeAdicional: string;

  @Column({ type: "text", nullable: true })
  inclui: string;

  @Column({ type: "text", nullable: true })
  naoInclui: string;

  @Column({ type: "boolean", default: true })
  ativo: boolean;

  @OneToMany(() => PropostaItem, (item) => item.itemCatalogo)
  itensProposta: PropostaItem[];

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
