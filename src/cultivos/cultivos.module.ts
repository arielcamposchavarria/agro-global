// import { Module } from '@nestjs/common';
// import { CultivosService } from './cultivos.service';
// import { CultivosController } from './cultivos.controller';

// @Module({
//   controllers: [CultivosController],
//   providers: [CultivosService],
// })
// export class CultivosModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { CultivosService } from './cultivos.service';
import { CultivosController } from './cultivos.controller';
import { Categoria } from '../categoria/entities/categoria.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo, Categoria, Usuario])],
  controllers: [CultivosController],
  providers: [CultivosService],
})
export class CultivosModule {}
