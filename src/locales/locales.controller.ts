import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { LocalesService } from './locales.service';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import { FilterLocaleDto } from './dto/filter-locale.dto';

@Controller('locales')
export class LocalesController {
  constructor(private readonly localesService: LocalesService) {}

  @Post()
  async create(@Body() createLocaleDto: CreateLocaleDto) {
    const locale = await this.localesService.create(createLocaleDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Local creado exitosamente',
      data: locale,
    };
  }

  @Get()
  async findAll(@Query() filterDto: FilterLocaleDto) {
    const result = await this.localesService.findAll(filterDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Locales obtenidos exitosamente',
      ...result,
    };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.localesService.getStats();
    return {
      statusCode: HttpStatus.OK,
      message: 'Estadísticas obtenidas exitosamente',
      data: stats,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const locale = await this.localesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Local obtenido exitosamente',
      data: locale,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocaleDto: UpdateLocaleDto,
  ) {
    const locale = await this.localesService.update(id, updateLocaleDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Local actualizado exitosamente',
      data: locale,
    };
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    const locale = await this.localesService.toggleStatus(id);
    return {
      statusCode: HttpStatus.OK,
      message: `Local ${locale.estado === 'activo' ? 'activado' : 'desactivado'} exitosamente`,
      data: locale,
    };
  }

  @Patch(':id/activate')
  async activate(@Param('id', ParseIntPipe) id: number) {
    const locale = await this.localesService.activate(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Local activado exitosamente',
      data: locale,
    };
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const locale = await this.localesService.deactivate(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Local desactivado exitosamente',
      data: locale,
    };
  }

  
}
