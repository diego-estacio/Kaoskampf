import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { CadastroDto } from "./dto/cadastro.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      throw new HttpException(
        error.message || "Erro interno do servidor",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("cadastro")
  async cadastrar(@Body() cadastroDto: CadastroDto) {
    try {
      return await this.authService.cadastrar(cadastroDto);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new HttpException(
          "Login ou email já está em uso",
          HttpStatus.CONFLICT
        );
      }
      throw new HttpException(
        "Erro ao criar usuário",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("esqueceu-senha")
  async esqueceuSenha(@Body("email") email: string) {
    try {
      await this.authService.esqueceuSenha(email);
      return { message: "Se o e-mail existir, as instruções foram enviadas." };
    } catch (error) {
      throw new HttpException(
        error.message || "Erro ao processar solicitação",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("redefinir-senha")
  async redefinirSenha(@Body() body: { token: string; novaSenha: string }) {
    try {
      await this.authService.redefinirSenha(body.token, body.novaSenha);
      return { message: "Senha alterada com sucesso." };
    } catch (error) {
      throw new HttpException(
        error.message || "Erro ao redefinir senha",
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}

