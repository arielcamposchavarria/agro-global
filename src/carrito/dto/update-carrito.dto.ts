import { PartialType } from '@nestjs/mapped-types';
import { CreateCarritoDto } from './create-carrito.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoCarrito } from '../entities/carrito.entity';

export class UpdateCarritoDto extends PartialType(CreateCarritoDto) {
  @IsOptional()
  @IsEnum(EstadoCarrito)
  estado?: EstadoCarrito;
}