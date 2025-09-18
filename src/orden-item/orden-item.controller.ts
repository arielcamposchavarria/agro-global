import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdenItemService } from './orden-item.service';
import { CreateOrdenItemDto } from './dto/create-orden-item.dto';
import { UpdateOrdenItemDto } from './dto/update-orden-item.dto';

@Controller('orden-item')
export class OrdenItemController {
  constructor(private readonly ordenItemService: OrdenItemService) {}

  @Post()
  create(@Body() createOrdenItemDto: CreateOrdenItemDto) {
    return this.ordenItemService.create(createOrdenItemDto);
  }

  @Get()
  findAll() {
    return this.ordenItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenItemDto: UpdateOrdenItemDto) {
    return this.ordenItemService.update(+id, updateOrdenItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenItemService.remove(+id);
  }
}
