import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Proposta } from "../../entities/proposta.entity";
import { PropostaItem } from "../../entities/proposta-item.entity";
import { CatalogoItem } from "../../entities/catalogo-item.entity";
import { Contato } from "../../entities/contato.entity";
import { Empresa } from "../../entities/empresa.entity";
import { Usuario } from "../../entities/usuario.entity";
import { Timeline } from "../../entities/timeline.entity";
import { Marca } from "../../entities/marca.entity";
import { PropostaService } from "./proposta.service";
import { IaPropostaService } from "./ia-proposta.service";
import { PropostaController } from "./proposta.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proposta,
      PropostaItem,
      CatalogoItem,
      Contato,
      Empresa,
      Usuario,
      Timeline,
      Marca,
    ]),
  ],
  controllers: [PropostaController],
  providers: [PropostaService, IaPropostaService],
  exports: [PropostaService],
})
export class PropostaModule {}
