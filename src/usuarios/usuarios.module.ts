// import { Module } from '@nestjs/common';
// import { UsuariosService } from './usuarios.service';
// import { UsuariosController } from './usuarios.controller';

// @Module({
//   controllers: [UsuariosController],
//   providers: [UsuariosService],
// })
// export class UsuariosModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Role])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}
