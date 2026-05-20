import { Injectable, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Usuario } from "../entities/usuario.entity";
import { LoginDto } from "./dto/login.dto";
import { CadastroDto } from "./dto/cadastro.dto";

import { EmailService } from "./email.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validarUsuario(login: string, senha: string): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({
      where: [{ login }, { email: login }],
    });

    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
      const { senha: _, ...resultado } = usuario;
      return resultado;
    }
    return null;
  }


  async login(loginDto: LoginDto) {
    const usuario = await this.validarUsuario(loginDto.login, loginDto.senha);

    if (!usuario) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const isMasterOrAdmin =
      usuario.role === "MASTER" || usuario.role === "ADMIN";

    // Bloquear se não estiver autorizado e não for Admin/Master
    if (usuario.autorizado !== true && !isMasterOrAdmin) {
      throw new ForbiddenException(
        "Sua conta ainda não foi autorizada por um administrador.",
      );
    }

    const payload = { login: usuario.login, sub: usuario.id };
    // DEBUG: logar role e funcao no login
    // Atenção: não logamos senha aqui
    console.log("[AuthService.login] Usuario autenticado:", {
      id: usuario.id,
      login: usuario.login,
      funcao: usuario.funcao,
      role: usuario.role,
    });
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        login: usuario.login,
        nome: usuario.nome,
        email: usuario.email,
        funcao: usuario.funcao,
        role: usuario.role || "MEMBER",
        notificacoesAtivadas: usuario.notificacoesAtivadas,
        diasAntesNotificacao: usuario.diasAntesNotificacao,
      },
    };
  }

  async cadastrar(cadastroDto: CadastroDto) {
    const senhaHash = await bcrypt.hash(cadastroDto.senha, 10);

    const novoUsuario = this.usuarioRepository.create({
      login: cadastroDto.login,
      nome: cadastroDto.nome,
      senha: senhaHash,
      email: cadastroDto.email,
      funcao: cadastroDto.funcao,
      role: "MEMBER",
      autorizado: false,
      notificacoesAtivadas: cadastroDto.notificacoesAtivadas ?? true,
      diasAntesNotificacao: cadastroDto.diasAntesNotificacao ?? 1,
    });

    const usuarioSalvo = await this.usuarioRepository.save(novoUsuario);
    const { senha: _, ...resultado } = usuarioSalvo;

    return resultado;
  }

  async buscarPorId(id: string): Promise<Usuario> {
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async esqueceuSenha(email: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    
    if (!usuario) {
      // Por segurança, não informamos que o e-mail não existe
      return;
    }

    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hora de validade

    await this.usuarioRepository.update(usuario.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    await this.emailService.sendPasswordResetEmail(usuario.email, token);
  }


  async redefinirSenha(token: string, novaSenha: string) {
    const { MoreThan } = await import('typeorm');
    
    const usuario = await this.usuarioRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!usuario) {
      throw new UnauthorizedException("Token inválido ou expirado.");
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await this.usuarioRepository.update(usuario.id, {
      senha: senhaHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }
}

