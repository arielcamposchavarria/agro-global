import { PartialType } from '@nestjs/mapped-types';
import { CreateOfertaDto } from './create-oferta.dto';
import { IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { EstadoOferta } from '../entities/oferta.entity';
import { Transform } from 'class-transformer';

export class UpdateOfertaDto extends PartialType(CreateOfertaDto) {
  @IsOptional()
  @IsEnum(EstadoOferta)
  estado?: EstadoOferta;
}

export class UpdateStockDto {
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  stock: number;
}

export class UpdatePrecioDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Transform(({ value }) => parseFloat(value))
  precio: number;
}