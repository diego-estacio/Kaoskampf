import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogoItem } from "../../entities/catalogo-item.entity";
import { Empresa } from "../../entities/empresa.entity";
import { CatalogoService } from "./catalogo.service";
import { CatalogoController } from "./catalogo.controller";

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoItem, Empresa])],
  controllers: [CatalogoController],
  providers: [CatalogoService],
  exports: [CatalogoService],
})
export class CatalogoModule {}
