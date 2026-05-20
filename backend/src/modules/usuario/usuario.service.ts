import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "../../entities/usuario.entity";
import { UsuarioRole } from "../../auth/roles.decorator";

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async buscarTodos(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      select: [
        "id",
        "login",
        "nome",
        "email",
        "funcao",
        "role",
        "autorizado",
        "criadoEm",
      ],
    });
  }

  async buscarPorId(id: string): Promise<Usuario> {
    return this.usuarioRepository.findOne({
      where: { id },
      select: [
        "id",
        "login",
        "nome",
        "email",
        "funcao",
        "role",
        "autorizado",
        "notificacoesAtivadas",
        "diasAntesNotificacao",
        "criadoEm",
      ],
    });
  }

  async atualizarPerfil(id: string, dados: Partial<Usuario>): Promise<Usuario> {
    await this.usuarioRepository.update(id, dados);
    return this.buscarPorId(id);
  }

  async atualizarRole(id: string, role: UsuarioRole): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new ForbiddenException("Usuário não encontrado");
    }

    // Nunca permitir alterar usuários MASTER (nem promover, nem rebaixar)
    if (usuario.role?.toUpperCase() === "MASTER") {
      throw new ForbiddenException("Não é permitido alterar usuários MASTER.");
    }

    await this.usuarioRepository.update(id, { role });
    return this.buscarPorId(id);
  }
 
  async autorizarUsuario(id: string, autorizado: boolean): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
 
    if (!usuario) {
      throw new ForbiddenException("Usuário não encontrado");
    }
 
    await this.usuarioRepository.update(id, { autorizado });
    return this.buscarPorId(id);
  }
}
