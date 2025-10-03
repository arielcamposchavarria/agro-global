import { IsOptional, IsString, IsNumber, IsEnum, IsInt, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EstadoOferta } from '../entities/oferta.entity';

export class FilterOfertaDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sellerId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  cultivoId?: number;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  precioMin?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  precioMax?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stockMin?: number;

  @IsOptional()
  @IsEnum(EstadoOferta)
  estado?: EstadoOferta;

  @IsOptional()
  @IsString()
  search?: string; 

  @IsOptional()
  @IsIn(['precio', 'stock', 'createdAt'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

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

  // Filtros adicionales
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  conStock?: boolean; 

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  activas?: boolean; 
}