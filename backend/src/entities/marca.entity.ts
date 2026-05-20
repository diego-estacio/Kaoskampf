import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";
import { Empresa } from "./empresa.entity";
import { CatalogoItem } from "./catalogo-item.entity";

@Entity("marcas")
export class Marca {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ length: 500, nullable: true })
  logo: string; // URL ou base64 da logo

  @Column({ length: 7, nullable: true })
  primaryColor: string; // Cor primária em hex

  @Column({ length: 50, nullable: true })
  icon: string; // ID do ícone Lucide (ex: 'building-2', 'drama', 'camera')

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  colorArray: string; // Cores separadas por #, ex: #0121B2#FF0080#FF9A04#null

  @Column({ length: 18, nullable: true })
  cnpj: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ default: true })
  ativa: boolean;

  @ManyToMany(() => Empresa, (empresa) => empresa.marcas)
  empresas: Empresa[];

  @ManyToMany(() => CatalogoItem, (item) => item.marcas)
  catalogoItens: CatalogoItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
