import { IsString, IsEnum, IsUUID, IsOptional } from "class-validator";
import { TipoAtividade } from "../../../entities/timeline.entity";

export class CriarTimelineDto {
  @IsString()
  atividade: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(TipoAtividade)
  tipo: TipoAtividade;

  @IsUUID()
  usuarioId: string;

  @IsUUID()
  contatoId: string;
}
