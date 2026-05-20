import { Controller, Get } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "../entities/usuario.entity";

@Controller("debug")
export class DebugController {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>
  ) {}

  @Get("database-info")
  async getDatabaseInfo() {
    try {
      // Verificar quantos usuários existem
      const count = await this.usuarioRepository.count();

      // Pegar informações da conexão
      const query = await this.usuarioRepository.query(
        "SELECT DATABASE() as current_db"
      );

      return {
        database: query[0]?.current_db,
        userCount: count,
        tableName: "usuarios",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
