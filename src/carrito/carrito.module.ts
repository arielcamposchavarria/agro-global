import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { Carrito } from './entities/carrito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrito])],
  controllers: [CarritoController],
  providers: [CarritoService],
  exports: [CarritoService], 
})
export class CarritoModule {}