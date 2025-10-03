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
  UseGuards,
  Request,
} from '@nestjs/common';
import { OfertasService } from './ofertas.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto, UpdateStockDto, UpdatePrecioDto } from './dto/update-oferta.dto';
import { FilterOfertaDto } from './dto/filter-oferta.dto';

@Controller('ofertas')
export class OfertasController {
  constructor(private readonly ofertasService: OfertasService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // Descomentar cuando tengas auth
  async create(
    @Body() createOfertaDto: CreateOfertaDto,
    // @Request() req, // Descomentar cuando tengas auth
  ) {
    // const sellerId = req.user.id; // Obtener del JWT
    const sellerId = 1; // Temporal - cambiar por req.user.id

    const oferta = await this.ofertasService.create(createOfertaDto, sellerId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Oferta creada exitosamente',
      data: oferta,
    };
  }

  @Get()
  async findAll(@Query() filterDto: FilterOfertaDto) {
    const result = await this.ofertasService.findAll(filterDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Ofertas obtenidas exitosamente',
      ...result,
    };
  }

  @Get('stats')
  async getGlobalStats() {
    const stats = await this.ofertasService.getGlobalStats();
    return {
      statusCode: HttpStatus.OK,
      message: 'Estadísticas globales obtenidas exitosamente',
      data: stats,
    };
  }

  @Get('my-stats')
  // @UseGuards(JwtAuthGuard)
  async getMyStats(
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const stats = await this.ofertasService.getStatsByUser(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Mis estadísticas obtenidas exitosamente',
      data: stats,
    };
  }

  @Get('my-ofertas')
  // @UseGuards(JwtAuthGuard)
  async getMyOfertas(
    @Query() filterDto: FilterOfertaDto,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const result = await this.ofertasService.findByUserId(userId, filterDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Mis ofertas obtenidas exitosamente',
      ...result,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const oferta = await this.ofertasService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Oferta obtenida exitosamente',
      data: oferta,
    };
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfertaDto: UpdateOfertaDto,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const oferta = await this.ofertasService.update(id, updateOfertaDto, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Oferta actualizada exitosamente',
      data: oferta,
    };
  }

  @Patch(':id/stock')
  // @UseGuards(JwtAuthGuard)
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockDto: UpdateStockDto,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const oferta = await this.ofertasService.updateStock(id, updateStockDto, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Stock actualizado exitosamente',
      data: oferta,
    };
  }

  @Patch(':id/precio')
  // @UseGuards(JwtAuthGuard)
  async updatePrecio(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePrecioDto: UpdatePrecioDto,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const oferta = await this.ofertasService.updatePrecio(id, updatePrecioDto, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Precio actualizado exitosamente',
      data: oferta,
    };
  }

  @Patch(':id/publish')
  // @UseGuards(JwtAuthGuard)
  async publish(
    @Param('id', ParseIntPipe) id: number,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const oferta = await this.ofertasService.publish(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Oferta publicada exitosamente',
      data: oferta,
    };
  }

  @Patch(':id/pause')
  // @UseGuards(JwtAuthGuard)
  async pause(
    @Param('id', ParseIntPipe) id: number,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const oferta = await this.ofertasService.pause(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Oferta pausada exitosamente',
      data: oferta,
    };
  }

  @Patch(':id/finalize')
  // @UseGuards(JwtAuthGuard)
  async finalize(
    @Param('id', ParseIntPipe) id: number,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const oferta = await this.ofertasService.finalize(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Oferta finalizada exitosamente',
      data: oferta,
    };
  }

  @Patch(':id/toggle-status')
  // @UseGuards(JwtAuthGuard)
  async toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const oferta = await this.ofertasService.toggleStatus(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: `Oferta ${oferta.estado} exitosamente`,
      data: oferta,
    };
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    await this.ofertasService.remove(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Oferta eliminada exitosamente',
    };
  }
}
