import { IsOptional, IsString, IsInt, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterLocaleDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  telefono?: number;

  @IsOptional()
  @IsString()
  localidad?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  estado?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => Math.max(1, parseInt(value) || 1))
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => Math.min(100, Math.max(1, parseInt(value) || 10)))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string; // Búsqueda general en nombre, email, localidad
}