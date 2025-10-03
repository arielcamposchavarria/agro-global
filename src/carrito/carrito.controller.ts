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
import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post()
  
  async create(
    @Body() createCarritoDto: CreateCarritoDto,
    
  ) {
    
    const userId = 1; 

    const carrito = await this.carritoService.create(createCarritoDto, userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Carrito creado exitosamente',
      data: carrito,
    };
  }

  @Get()
  async findAll() {
    const carritos = await this.carritoService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Carritos obtenidos exitosamente',
      data: carritos,
    };
  }

  @Get('active')
  
  async getActiveCart(
    
  ) {
   
    const userId = 1; 

    const carrito = await this.carritoService.getOrCreateActiveCart(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Carrito activo obtenido exitosamente',
      data: carrito,
    };
  }

  @Get('my-carts')
 
  async getMyCarts(
    
  ) {
    
    const userId = 1; 

    const carritos = await this.carritoService.findByUserId(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Mis carritos obtenidos exitosamente',
      data: carritos,
    };
  }

  @Get('stats')
 
  async getStats(
   
  ) {
   
    const userId = 1; 

    const stats = await this.carritoService.getCartStats(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Estadísticas del carrito obtenidas exitosamente',
      data: stats,
    };
  }

  @Get('global-stats')
  async getGlobalStats() {
    const stats = await this.carritoService.getGlobalStats();
    return {
      statusCode: HttpStatus.OK,
      message: 'Estadísticas globales obtenidas exitosamente',
      data: stats,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const carrito = await this.carritoService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Carrito obtenido exitosamente',
      data: carrito,
    };
  }

  @Patch(':id')
 
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarritoDto: UpdateCarritoDto,
    
  ) {
    
    const userId = 1; 

    const carrito = await this.carritoService.update(id, updateCarritoDto, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Carrito actualizado exitosamente',
      data: carrito,
    };
  }

  // === CAMBIOS DE ESTADO ===

  @Patch(':id/lock')
 
  async lockCart(
    @Param('id', ParseIntPipe) id: number,
    
  ) {
    
    const userId = 1; 

    const carrito = await this.carritoService.lockCart(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Carrito bloqueado exitosamente',
      data: carrito,
    };
  }

  @Patch(':id/unlock')
  
  async unlockCart(
    @Param('id', ParseIntPipe) id: number,
    
  ) {
    
    const userId = 1; 

    const carrito = await this.carritoService.unlockCart(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Carrito desbloqueado exitosamente',
      data: carrito,
    };
  }
bjcsichsih
  @Patch(':id/checkout')

  async checkoutCart(
    @Param('id', ParseIntPipe) id: number,
    
  ) {
    
    const userId = 1; 

    const carrito = await this.carritoService.checkoutCart(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Carrito finalizado exitosamente',
      data: carrito,
    };
  }

  @Patch('abandon')
  
  async abandonCart(
    
  ) {
    
    const userId = 1; 

    const carrito = await this.carritoService.abandonCart(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Carrito abandonado exitosamente',
      data: carrito,
    };
  }

  @Patch(':id/reactivate')
  
  async reactivateCart(
    @Param('id', ParseIntPipe) id: number,
   
  ) {
   
    const userId = 1; 

    const carrito = await this.carritoService.reactivateCart(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Carrito reactivado exitosamente',
      data: carrito,
    };
  }

  @Delete(':id')
 
  async remove(
    @Param('id', ParseIntPipe) id: number,
    
  ) {
    
    const userId = 1; 

    await this.carritoService.remove(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Carrito eliminado exitosamente',
    };
  }
}