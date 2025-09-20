// import { Module } from '@nestjs/common';
// import { LotesService } from './lotes.service';
// import { LotesController } from './lotes.controller';

// @Module({
//   controllers: [LotesController],
//   providers: [LotesService],
// })
// export class LotesModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lote } from './entities/lote.entity';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lote, Usuario])],
  controllers: [LotesController],
  providers: [LotesService],
  exports: [TypeOrmModule, LotesService],
})
export class LotesModule {}
