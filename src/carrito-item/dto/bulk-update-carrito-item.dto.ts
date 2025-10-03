import { IsArray, ValidateNested, IsInt, IsNumber, IsPositive } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class BulkUpdateItemDto {
  @IsInt()
  @IsPositive()
  itemId: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  qty: number;
}

export class BulkUpdateCarritoItemDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateItemDto)
  items: BulkUpdateItemDto[];
}