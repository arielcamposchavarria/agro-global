import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CarritoItemService } from './carrito-item.service';
import { CreateCarritoItemDto } from './dto/create-carrito-item.dto';
import { UpdateCarritoItemDto } from './dto/update-carrito-item.dto';
import { BulkUpdateCarritoItemDto } from './dto/bulk-update-carrito-item.dto';

@Controller('carrito-item')
export class CarritoItemController {
  constructor(private readonly carritoItemService: CarritoItemService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // Descomentar cuando tengas auth
  async addItem(
    @Body() createItemDto: CreateCarritoItemDto,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const item = await this.carritoItemService.addItem(userId, createItemDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Item agregado al carrito exitosamente',
      data: item,
    };
  }

  @Get('my-items')
  // @UseGuards(JwtAuthGuard)
  async getMyItems(
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const items = await this.carritoItemService.findAllByUserId(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Items del carrito obtenidos exitosamente',
      data: items,
    };
  }

  @Get('summary')
  // @UseGuards(JwtAuthGuard)
  async getCartSummary(
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const summary = await this.carritoItemService.getCartSummary(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Resumen del carrito obtenido exitosamente',
      data: summary,
    };
  }

  @Get('validate-stock')
  // @UseGuards(JwtAuthGuard)
  async validateStock(
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const validation = await this.carritoItemService.validateCartStock(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Validación de stock completada',
      data: validation,
    };
  }

  @Get('stats')
  // @UseGuards(JwtAuthGuard)
  async getItemStats(
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const stats = await this.carritoItemService.getItemStats(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Estadísticas de items obtenidas exitosamente',
      data: stats,
    };
  }

  @Get('cart/:cartId')
  async getItemsByCartId(@Param('cartId', ParseIntPipe) cartId: number) {
    const items = await this.carritoItemService.findAllByCartId(cartId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Items del carrito obtenidos exitosamente',
      data: items,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const item = await this.carritoItemService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Item obtenido exitosamente',
      data: item,
    };
  }

  @Patch('bulk-update')
  // @UseGuards(JwtAuthGuard)
  async bulkUpdateItems(
    @Body() bulkUpdateDto: BulkUpdateCarritoItemDto,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const items = await this.carritoItemService.bulkUpdateItems(userId, bulkUpdateDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Items actualizados exitosamente',
      data: items,
    };
  }

  @Patch('sync-prices')
  // @UseGuards(JwtAuthGuard)
  async syncPrices(
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const updatedItems = await this.carritoItemService.syncPrices(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Precios sincronizados exitosamente',
      data: {
        updatedItems,
        totalUpdated: updatedItems.length,
      },
    };
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateCarritoItemDto,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    const item = await this.carritoItemService.updateItemQty(id, updateItemDto, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Item actualizado exitosamente',
      data: item,
    };
  }

  @Delete('clear')
  // @UseGuards(JwtAuthGuard)
  async clearItems(
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    await this.carritoItemService.clearCartItems(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Carrito vaciado exitosamente',
    };
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  async removeItem(
    @Param('id', ParseIntPipe) id: number,
    // @Request() req,
  ) {
    // const userId = req.user.id;
    const userId = 1; // Temporal

    await this.carritoItemService.removeItem(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Item eliminado del carrito exitosamente',
    };
  }
}
