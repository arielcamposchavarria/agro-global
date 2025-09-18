import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OfertasService } from './ofertas.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';

@Controller('ofertas')
export class OfertasController {
  constructor(private readonly ofertasService: OfertasService) {}

  @Post()
  create(@Body() createOfertaDto: CreateOfertaDto) {
    return this.ofertasService.create(createOfertaDto);
  }

  @Get()
  findAll() {
    return this.ofertasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ofertasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfertaDto: UpdateOfertaDto) {
    return this.ofertasService.update(+id, updateOfertaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ofertasService.remove(+id);
  }
}
