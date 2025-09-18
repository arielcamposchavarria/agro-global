// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { RolesService } from './roles.service';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';

// @Controller('roles')
// export class RolesController {
//   constructor(private readonly rolesService: RolesService) {}

//   @Post()
//   create(@Body() createRoleDto: CreateRoleDto) {
//     return this.rolesService.create(createRoleDto);
//   }

//   @Get()
//   findAll() {
//     return this.rolesService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.rolesService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
//     return this.rolesService.update(+id, updateRoleDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.rolesService.remove(+id);
//   }
// }
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly roles: RolesService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roles.create(dto);
  }

  @Get()
  findAll() {
    return this.roles.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roles.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.roles.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roles.remove(id);
  }
}
