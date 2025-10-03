import { IsString, IsNumber, IsOptional, IsEnum, IsPositive, MaxLength, Min, IsNotEmpty, IsInt } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EstadoOferta } from '../entities/oferta.entity';

export class CreateOfertaDto {
  @IsInt()
  @IsPositive()
  cultivoId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unidad: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  precio: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  stock: number;

  @IsOptional()
  @IsEnum(EstadoOferta)
  estado?: EstadoOferta = EstadoOferta.BORRADOR;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  foto?: string;

  @IsOptional()
  @IsString()
  comentario?: string;
}
