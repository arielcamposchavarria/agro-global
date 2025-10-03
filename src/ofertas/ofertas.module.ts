import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertasService } from './ofertas.service';
import { OfertasController } from './ofertas.controller';
import { Oferta } from './entities/oferta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Oferta])],
  controllers: [OfertasController],
  providers: [OfertasService],
  exports: [OfertasService], // Para usar en carrito y órdenes
})
export class OfertasModule {}