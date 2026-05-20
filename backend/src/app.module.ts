import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";
import { UsuarioModule } from "./modules/usuario/usuario.module";
import { ContatoModule } from "./modules/contato/contato.module";
import { EmpresaModule } from "./modules/empresa/empresa.module";
import { TimelineModule } from "./modules/timeline/timeline.module";
import { NotificacaoModule } from "./modules/notificacao/notificacao.module";
import { KanbanModule } from "./modules/kanban/kanban.module";
import { MarcaModule } from "./modules/marca/marca.module";
import { CatalogoModule } from "./modules/catalogo/catalogo.module";
import { PropostaModule } from "./modules/proposta/proposta.module";
import { NotaModule } from "./modules/nota/nota.module";
import { PlannerModule } from "./modules/planner/planner.module";
import { HealthController } from "./health/health.controller";
import { Usuario } from "./entities/usuario.entity";
import { Contato } from "./entities/contato.entity";
import { Empresa } from "./entities/empresa.entity";
import { Timeline } from "./entities/timeline.entity";
import { Notificacao } from "./entities/notificacao.entity";
import { KanbanColuna } from "./entities/kanban-coluna.entity";
import { Observacao } from "./entities/observacao.entity";
import { Marca } from "./entities/marca.entity";
import { CatalogoItem } from "./entities/catalogo-item.entity";
import { Proposta } from "./entities/proposta.entity";
import { PropostaItem } from "./entities/proposta-item.entity";
import { Nota } from "./entities/nota.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(), // ✅ Ativa os jobs automáticos
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "root",
      database: process.env.DB_NAME || "hubee_db",
      entities: [
        Usuario,
        Contato,
        Empresa,
        Timeline,
        Notificacao,
        KanbanColuna,
        Observacao,
        Marca,
        CatalogoItem,
        Proposta,
        PropostaItem,
        Nota,
      ],
      synchronize: false, // Apenas em desenvolvimento


      charset: "utf8mb4",
      // Alinhar timezone da conexão com o timezone real do banco (UTC-3)
      // para que os Date gerados pelo TypeORM representem o instante correto em UTC
      timezone: "-03:00",
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    }),
    AuthModule,
    UsuarioModule,
    ContatoModule,
    EmpresaModule,
    TimelineModule,
    NotificacaoModule,
    KanbanModule,
    MarcaModule,
    CatalogoModule,
    PropostaModule,
    NotaModule,
    PlannerModule,
  ],
  controllers: [HealthController],
})
export class AppModule {} // trigger restart
