// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { ActividadesService } from './actividades.service';
// import { CreateActividadeDto } from './dto/create-actividade.dto';
// import { UpdateActividadeDto } from './dto/update-actividade.dto';

// @Controller('actividades')
// export class ActividadesController {
//   constructor(private readonly actividadesService: ActividadesService) {}

//   @Post()
//   create(@Body() createActividadeDto: CreateActividadeDto) {
//     return this.actividadesService.create(createActividadeDto);
//   }

//   @Get()
//   findAll() {
//     return this.actividadesService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.actividadesService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateActividadeDto: UpdateActividadeDto) {
//     return this.actividadesService.update(+id, updateActividadeDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.actividadesService.remove(+id);
//   }
// }
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly service: ActividadesService) {}

  @Post()
  create(@Body() dto: CreateActividadDto){
    return this.service.create(dto); }
  @Get() 
  findAll() { 
    return this.service.findAll(); }
  @Get(':id') 
  findOne(@Param('id', ParseIntPipe) id: number) { 
    return this.service.findOne(id); }
  @Patch(':id') 
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateActividadeDto) { 
    return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { 
    return this.service.remove(id); }
}
