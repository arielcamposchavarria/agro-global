import { Module } from '@nestjs/common';
import { OrdenItemService } from './orden-item.service';
import { OrdenItemController } from './orden-item.controller';

@Module({
  controllers: [OrdenItemController],
  providers: [OrdenItemService],
})
export class OrdenItemModule {}
