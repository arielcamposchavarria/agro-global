import { PartialType } from '@nestjs/mapped-types';
import { CreateLocaleDto } from './create-locale.dto';
import { IsOptional, IsIn } from 'class-validator';

export class UpdateLocaleDto extends PartialType(CreateLocaleDto) {
  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  estado?: string;
}