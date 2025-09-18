import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { LotesModule } from './lotes/lotes.module';
import { CategoriaModule } from './categoria/categoria.module';
import { CultivosModule } from './cultivos/cultivos.module';
import { ActividadesModule } from './actividades/actividades.module';
import { LocalesModule } from './locales/locales.module';
import { OfertasModule } from './ofertas/ofertas.module';
import { CarritoModule } from './carrito/carrito.module';
import { CarritoItemModule } from './carrito-item/carrito-item.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { OrdenItemModule } from './orden-item/orden-item.module';

@Module({
  imports: [UsuariosModule, RolesModule, LotesModule, CategoriaModule, CultivosModule, ActividadesModule, LocalesModule, OfertasModule, CarritoModule, CarritoItemModule, OrdenesModule, OrdenItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
