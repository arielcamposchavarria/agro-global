// import { Module } from '@nestjs/common';
// import { ActividadesService } from './actividades.service';
// import { ActividadesController } from './actividades.controller';

// @Module({
//   controllers: [ActividadesController],
//   providers: [ActividadesService],
// })
// export class ActividadesModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from './entities/actividade.entity';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { Cultivo } from '../cultivos/entities/cultivo.entity';
import { Lote } from '../lotes/entities/lote.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad, Cultivo, Lote, Usuario])],
  controllers: [ActividadesController],
  providers: [ActividadesService],
})
export class ActividadesModule {}
