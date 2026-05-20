import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const usuario = await this.authService.buscarPorId(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException("Usuário não encontrado.");
    }

    const isMasterOrAdmin =
      usuario.role === "MASTER" || usuario.role === "ADMIN";

    // Bloquear se não estiver autorizado e não for Admin/Master
    if (usuario.autorizado !== true && !isMasterOrAdmin) {
      throw new UnauthorizedException(
        "Sua conta não está autorizada ou o acesso foi suspenso.",
      );
    }

    return usuario;
  }
}
