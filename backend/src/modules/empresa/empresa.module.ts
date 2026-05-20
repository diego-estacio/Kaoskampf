import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmpresaController } from "./empresa.controller";
import { EmpresaService } from "./empresa.service";
import { Empresa } from "../../entities/empresa.entity";
import { Contato } from "../../entities/contato.entity";
import { Marca } from "../../entities/marca.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, Contato, Marca])],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports: [EmpresaService],
})
export class EmpresaModule {}
