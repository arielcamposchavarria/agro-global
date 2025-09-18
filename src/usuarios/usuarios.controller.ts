// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { UsuariosService } from './usuarios.service';
// import { CreateUsuarioDto } from './dto/create-usuario.dto';
// import { UpdateUsuarioDto } from './dto/update-usuario.dto';

// @Controller('usuarios')
// export class UsuariosController {
//   constructor(private readonly usuariosService: UsuariosService) {}

//   @Post()
//   create(@Body() createUsuarioDto: CreateUsuarioDto) {
//     return this.usuariosService.create(createUsuarioDto);
//   }

//   @Get()
//   findAll() {
//     return this.usuariosService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.usuariosService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
//     return this.usuariosService.update(+id, updateUsuarioDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.usuariosService.remove(+id);
//   }
// }
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { QueryUsuariosDto } from './dto/query-usuarios.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuarios: UsuariosService) {}

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuarios.create(dto);
  }

  @Get()
  findAll(@Query() q: QueryUsuariosDto) {
    return this.usuarios.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarios.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.usuarios.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarios.remove(id);
  }
}
