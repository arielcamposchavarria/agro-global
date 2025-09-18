import { Module, ValidationPipe } from '@nestjs/common';
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
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
   imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // disponible en todo el proyecto
    }),

    // Configuración de TypeORM con ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // ⚠️ en prod: false y usar migraciones
      }),
    }),


    UsuariosModule,
    RolesModule,
    LotesModule,
    CategoriaModule,
    CultivosModule,
    ActividadesModule,
    LocalesModule,
    OfertasModule,
    CarritoModule,
    CarritoItemModule,
    OrdenesModule,
    OrdenItemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Validación global para todos los DTOs
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true, // elimina propiedades que no estén en el DTO
          forbidNonWhitelisted: true, // lanza error si llegan propiedades extra
          transform: true, // convierte tipos (ej: string → number)
        }),
    },
  ],
})
export class AppModule {}
