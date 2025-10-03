import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCarritoItemDto {
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  qty: number;
}
