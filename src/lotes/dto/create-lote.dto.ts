import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoteDto {
  @Type(() => Number) @IsInt()
  agricultor_id: number;

  @IsString() @IsNotEmpty() @MaxLength(100)
  nombre: string;

  @IsOptional() @IsString() // decimal llega como string
  area_ha?: string;

  @IsOptional() @IsString() @MaxLength(200)
  ubicacion?: string;

  @IsOptional() @IsString()
  notas?: string;
}
