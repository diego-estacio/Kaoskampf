import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContatoController } from "./contato.controller";
import { ContatoService } from "./contato.service";
import { Contato } from "../../entities/contato.entity";
import { Empresa } from "../../entities/empresa.entity";
import { Timeline } from "../../entities/timeline.entity";
import { Observacao } from "../../entities/observacao.entity";
import { Usuario } from "../../entities/usuario.entity";
import { EmpresaModule } from "../empresa/empresa.module";
import { NotificacaoModule } from "../notificacao/notificacao.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Contato, Empresa, Timeline, Observacao, Usuario]),
    EmpresaModule,
    NotificacaoModule,
  ],
  controllers: [ContatoController],
  providers: [ContatoService],
  exports: [ContatoService],
})
export class ContatoModule {}
