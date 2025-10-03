import { IsString, IsEmail, IsOptional, IsInt, MaxLength, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLocaleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? parseInt(value) : null)
  telefono?: number;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  localidad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  estado?: string = 'activo';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  logo?: string;
}
