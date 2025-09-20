// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { CategoriaService } from './categoria.service';
// import { CreateCategoriaDto } from './dto/create-categoria.dto';
// import { UpdateCategoriaDto } from './dto/update-categoria.dto';

// @Controller('categoria')
// export class CategoriaController {
//   constructor(private readonly categoriaService: CategoriaService) {}

//   @Post()
//   create(@Body() createCategoriaDto: CreateCategoriaDto) {
//     return this.categoriaService.create(createCategoriaDto);
//   }

//   @Get()
//   findAll() {
//     return this.categoriaService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.categoriaService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
//     return this.categoriaService.update(+id, updateCategoriaDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.categoriaService.remove(+id);
//   }
// }
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  @Post()
  create(@Body() dto: CreateCategoriaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
