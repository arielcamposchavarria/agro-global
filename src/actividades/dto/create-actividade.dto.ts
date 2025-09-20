import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoActividad } from '../entities/tipo-actividad.enum';

export class CreateActividadDto {
  @Type(() => Number) @IsInt()
  cultivo_id: number;

  @Type(() => Number) @IsInt()
  agricultor_id: number;

  @IsEnum(TipoActividad)
  tipo: TipoActividad;

  @IsOptional() @IsString() @MaxLength(255)
  detalle?: string;

  @Type(() => Number) @IsInt()
  lote_id: number;

  @IsOptional() @IsString() @MaxLength(255)
  cantidad?: string;

  @IsOptional() @IsString() @MaxLength(50)
  unidad?: string;

  @IsISO8601() // formato ISO: "2025-09-20T14:30:00"
  fechaInicio: string;

  @IsOptional() @IsISO8601()
  fechaFinal?: string;

  @IsOptional() @IsString()
  notas?: string;
}
