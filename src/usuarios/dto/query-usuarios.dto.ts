import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class QueryUsuariosDto {
  @IsOptional() @IsString()
  search?: string; // busca en nombre/apellido/email

  @IsOptional() @IsString() @IsIn(['activo', 'suspendido'])
  estado?: string;

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit?: number = 15;

  @IsOptional() @Type(() => Number) @IsInt()
  rolId?: number;
}
