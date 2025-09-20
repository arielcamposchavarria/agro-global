import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, MaxLength, IsNumberString } from 'class-validator';
import { EstadoCultivo } from '../entities/estado-cultivo.enum';

export class CreateCultivoDto {
  // bigint -> lo recibimos como string
  @IsInt()
  agricultor_id: number;

  @IsInt()
  categoria_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  variedad?: string;

  @IsOptional()
  @IsEnum(EstadoCultivo)
  estado?: EstadoCultivo; // por defecto: pendiente

  @IsOptional()
  @IsString()
  notas?: string;
}
