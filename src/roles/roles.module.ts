// import { Module } from '@nestjs/common';
// import { RolesService } from './roles.service';
// import { RolesController } from './roles.controller';

// @Module({
//   controllers: [RolesController],
//   providers: [RolesService],
// })
// export class RolesModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [TypeOrmModule, RolesService],
})
export class RolesModule {}
