import { IsNumber, IsPositive, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCarritoItemDto {
  @IsInt()
  @IsPositive()
  ofertaId: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  qty: number;
}
