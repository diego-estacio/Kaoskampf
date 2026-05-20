import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Proposta } from "./proposta.entity";
import { CatalogoItem } from "./catalogo-item.entity";
import { TipoDesconto, PricingTier } from "./enums";
export { TipoDesconto, PricingTier };

// @deprecated Use TipoDesconto

@Entity("proposta_itens")
export class PropostaItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Proposta, (proposta) => proposta.itens, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "propostaId" })
  proposta: Proposta;

  @Column({ type: "uuid" })
  propostaId: string;

  @ManyToOne(() => CatalogoItem, (item) => item.itensProposta, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "itemCatalogoId" })
  itemCatalogo: CatalogoItem | null;

  @Column({ type: "uuid", nullable: true })
  itemCatalogoId: string | null;

  // Nome e descricao podem ser editados na proposta independentemente do catalogo
  @Column({ length: 255 })
  nome: string;

  @Column({ type: "text", nullable: true })
  descricao: string;

  @Column({ type: "text", nullable: true })
  inclui: string | null;

  @Column({ type: "text", nullable: true })
  naoInclui: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 1 })
  quantidade: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  precoUnitario: number;

  @Column({ type: "enum", enum: TipoDesconto, nullable: true })
  tipoDesconto: TipoDesconto | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  valorDesconto: number | null;

  // Valor total do item (quantidade * precoUnitario - desconto)
  @Column({ type: "decimal", precision: 10, scale: 2 })
  precoTotal: number;

  @Column({ type: "int", default: 0 })
  ordem: number;

  @Column({
    type: "enum",
    enum: PricingTier,
    nullable: true,
    default: null,
  })
  pricingTier: PricingTier | null;
}
