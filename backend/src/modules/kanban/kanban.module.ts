import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KanbanColuna } from "../../entities/kanban-coluna.entity";
import { Empresa } from "../../entities/empresa.entity";
import { KanbanService } from "./kanban.service";
import { KanbanController } from "./kanban.controller";

@Module({
  imports: [TypeOrmModule.forFeature([KanbanColuna, Empresa])],
  providers: [KanbanService],
  controllers: [KanbanController],
  exports: [KanbanService],
})
export class KanbanModule {}
