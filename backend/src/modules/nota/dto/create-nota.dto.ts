import { IsString, IsEnum, IsNotEmpty } from "class-validator";
import { CategoriaNota } from "../../../entities/nota.entity";

export class CreateNotaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  texto: string;

  @IsEnum(CategoriaNota)
  @IsNotEmpty()
  categoria: CategoriaNota;
}
