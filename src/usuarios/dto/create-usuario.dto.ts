import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsInt()
  rolId: number;

  @IsString() @IsNotEmpty() @MaxLength(100)
  nombre: string;

  @IsString() @IsOptional() @MaxLength(100)
  apellido?: string;

  @IsEmail() @MaxLength(120)
  email: string;

  // password en DTO de entrada (se convertirá a hash)
  @IsString() @MinLength(8) @MaxLength(128)
  password: string;

  @IsString() @IsOptional() @MaxLength(255)
  direccion?: string;

  @IsString() @IsOptional() @MaxLength(30)
  telefono?: string;

  @IsString() @IsOptional()
  @IsIn(['activo', 'suspendido'])
  estado?: string = 'activo';
}

