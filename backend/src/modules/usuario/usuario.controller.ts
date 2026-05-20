import { Controller, Get, Put, Body, Param, UseGuards, Patch } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { UsuarioService } from "./usuario.service";
import { Usuario } from "../../entities/usuario.entity";
import { Roles, UsuarioRole } from "../../auth/roles.decorator";
import { RolesGuard } from "../../auth/roles.guard";

@Controller("usuarios")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "MASTER")
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Get()
  async buscarTodos(): Promise<Usuario[]> {
    return this.usuarioService.buscarTodos();
  }

  @Get(":id")
  async buscarPorId(@Param("id") id: string): Promise<Usuario> {
    return this.usuarioService.buscarPorId(id);
  }

  @Put(":id")
  async atualizarPerfil(
    @Param("id") id: string,
    @Body() dados: Partial<Usuario>
  ): Promise<Usuario> {
    return this.usuarioService.atualizarPerfil(id, dados);
  }

  // Atualização dedicada de role, restrita a MASTER
  @Put(":id/role")
  @Roles("MASTER")
  async atualizarRole(
    @Param("id") id: string,
    @Body("role") role: UsuarioRole,
  ): Promise<Usuario> {
    return this.usuarioService.atualizarRole(id, role);
  }
 
  @Patch(":id/autorizar")
  async autorizarUsuario(
    @Param("id") id: string,
    @Body("autorizado") autorizado: boolean,
  ): Promise<Usuario> {
    return this.usuarioService.autorizarUsuario(id, autorizado);
  }
}
