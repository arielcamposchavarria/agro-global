import { IsOptional, IsEnum } from 'class-validator';
import { EstadoCarrito } from '../entities/carrito.entity';

export class CreateCarritoDto {
  @IsOptional()
  @IsEnum(EstadoCarrito)
  estado?: EstadoCarrito = EstadoCarrito.OPEN;
}