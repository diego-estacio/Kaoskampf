import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNumber,
  MinLength,
} from "class-validator";

export class CadastroDto {
  @IsString()
  @MinLength(3)
  login: string;

  @IsString()
  @MinLength(2)
  nome: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsEmail()
  email: string;

  @IsString()
  funcao: string;

  @IsOptional()
  @IsBoolean()
  notificacoesAtivadas?: boolean;

  @IsOptional()
  @IsNumber()
  diasAntesNotificacao?: number;
}
