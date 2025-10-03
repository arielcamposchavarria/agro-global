import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoItemService } from './carrito-item.service';
import { CarritoItemController } from './carrito-item.controller';
import { CarritoItem } from './entities/carrito-item.entity';
import { CarritoModule } from '../carrito/carrito.module';
import { OfertasModule } from '../ofertas/ofertas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarritoItem]),
    CarritoModule, // Para gestión de carritos
    OfertasModule, // Para validar ofertas
  ],
  controllers: [CarritoItemController],
  providers: [CarritoItemService],
  exports: [CarritoItemService], // Para usar en órdenes
})
export class CarritoItemModule {}