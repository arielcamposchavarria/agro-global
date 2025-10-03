import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito, EstadoCarrito } from './entities/carrito.entity';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
  ) {}

  async create(createCarritoDto: CreateCarritoDto, userId: number): Promise<Carrito> {
    // Verificar si ya existe un carrito activo
    const existingCart = await this.carritoRepository.findOne({
      where: { 
        userId, 
        estado: EstadoCarrito.OPEN 
      }
    });

    if (existingCart) {
      throw new ConflictException('Ya tienes un carrito activo');
    }

    const carrito = this.carritoRepository.create({
      ...createCarritoDto,
      userId,
    });

    return await this.carritoRepository.save(carrito);
  }

  async getOrCreateActiveCart(userId: number): Promise<Carrito> {
    // Buscar carrito activo existente
    let carrito = await this.carritoRepository.findOne({
      where: { 
        userId, 
        estado: EstadoCarrito.OPEN 
      },
      relations: ['user'],
    });

    // Si no existe, crear uno nuevo
    if (!carrito) {
      carrito = await this.create({ estado: EstadoCarrito.OPEN }, userId);
    }

    return carrito;
  }

  async findAll(): Promise<Carrito[]> {
    return await this.carritoRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: number): Promise<Carrito[]> {
    return await this.carritoRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Carrito> {
    const carrito = await this.carritoRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!carrito) {
      throw new NotFoundException(`Carrito con ID ${id} no encontrado`);
    }

    return carrito;
  }

  async update(id: number, updateCarritoDto: UpdateCarritoDto, userId?: number): Promise<Carrito> {
    const carrito = await this.findOne(id);

    if (userId && carrito.userId !== userId) {
      throw new BadRequestException('No tienes permisos para actualizar este carrito');
    }

    await this.carritoRepository.update(id, updateCarritoDto);
    return await this.findOne(id);
  }

  // === CAMBIOS DE ESTADO ===

  async lockCart(cartId: number, userId?: number): Promise<Carrito> {
    const carrito = await this.findOne(cartId);

    if (userId && carrito.userId !== userId) {
      throw new BadRequestException('No tienes permisos para bloquear este carrito');
    }

    if (carrito.estado !== EstadoCarrito.OPEN) {
      throw new BadRequestException('Solo se pueden bloquear carritos activos');
    }

    await this.carritoRepository.update(cartId, { 
      estado: EstadoCarrito.LOCKED 
    });
    
    return await this.findOne(cartId);
  }

  async unlockCart(cartId: number, userId?: number): Promise<Carrito> {
    const carrito = await this.findOne(cartId);

    if (userId && carrito.userId !== userId) {
      throw new BadRequestException('No tienes permisos para desbloquear este carrito');
    }

    if (carrito.estado !== EstadoCarrito.LOCKED) {
      throw new BadRequestException('Solo se pueden desbloquear carritos bloqueados');
    }

    await this.carritoRepository.update(cartId, { 
      estado: EstadoCarrito.OPEN 
    });
    
    return await this.findOne(cartId);
  }

  async checkoutCart(cartId: number, userId?: number): Promise<Carrito> {
    const carrito = await this.findOne(cartId);

    if (userId && carrito.userId !== userId) {
      throw new BadRequestException('No tienes permisos para finalizar este carrito');
    }

    if (carrito.estado !== EstadoCarrito.LOCKED) {
      throw new BadRequestException('El carrito debe estar bloqueado antes de finalizar');
    }

    await this.carritoRepository.update(cartId, { 
      estado: EstadoCarrito.CHECKED_OUT 
    });
    
    return await this.findOne(cartId);
  }

  async abandonCart(userId: number): Promise<Carrito> {
    const carrito = await this.getOrCreateActiveCart(userId);
    
    if (carrito.estado !== EstadoCarrito.OPEN) {
      throw new BadRequestException('Solo se pueden abandonar carritos activos');
    }

    await this.carritoRepository.update(carrito.id, { 
      estado: EstadoCarrito.ABANDONED 
    });
    
    return await this.findOne(carrito.id);
  }

  async reactivateCart(cartId: number, userId?: number): Promise<Carrito> {
    const carrito = await this.findOne(cartId);

    if (userId && carrito.userId !== userId) {
      throw new BadRequestException('No tienes permisos para reactivar este carrito');
    }

    if (carrito.estado !== EstadoCarrito.ABANDONED) {
      throw new BadRequestException('Solo se pueden reactivar carritos abandonados');
    }

    // Verificar que no tenga otro carrito activo
    const activeCart = await this.carritoRepository.findOne({
      where: { 
        userId: carrito.userId, 
        estado: EstadoCarrito.OPEN 
      }
    });

    if (activeCart) {
      throw new ConflictException('Ya tienes un carrito activo. Abandona el actual primero.');
    }

    await this.carritoRepository.update(cartId, { 
      estado: EstadoCarrito.OPEN 
    });
    
    return await this.findOne(cartId);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const carrito = await this.findOne(id);

    if (userId && carrito.userId !== userId) {
      throw new BadRequestException('No tienes permisos para eliminar este carrito');
    }

    // Solo permitir eliminar carritos abandonados o finalizados
    if (![EstadoCarrito.ABANDONED, EstadoCarrito.CHECKED_OUT].includes(carrito.estado)) {
      throw new BadRequestException('Solo se pueden eliminar carritos abandonados o finalizados');
    }

    await this.carritoRepository.remove(carrito);
  }

  // === ESTADÍSTICAS ===

  async getCartStats(userId: number): Promise<{
    carritoActivo: Carrito | null;
    totalCarritos: number;
    carritosAbiertos: number;
    carritosFinalizados: number;
    carritosAbandonados: number;
    carritosBloqueados: number;
  }> {
    const carritos = await this.carritoRepository.find({
      where: { userId },
    });

    const carritoActivo = carritos.find(c => c.estado === EstadoCarrito.OPEN) || null;
    const carritosAbiertos = carritos.filter(c => c.estado === EstadoCarrito.OPEN).length;
    const carritosFinalizados = carritos.filter(c => c.estado === EstadoCarrito.CHECKED_OUT).length;
    const carritosAbandonados = carritos.filter(c => c.estado === EstadoCarrito.ABANDONED).length;
    const carritosBloqueados = carritos.filter(c => c.estado === EstadoCarrito.LOCKED).length;

    return {
      carritoActivo,
      totalCarritos: carritos.length,
      carritosAbiertos,
      carritosFinalizados,
      carritosAbandonados,
      carritosBloqueados,
    };
  }

  async getGlobalStats(): Promise<{
    totalCarritos: number;
    carritosActivos: number;
    carritosFinalizados: number;
    carritosAbandonados: number;
    carritosBloqueados: number;
  }> {
    const carritos = await this.carritoRepository.find();

    return {
      totalCarritos: carritos.length,
      carritosActivos: carritos.filter(c => c.estado === EstadoCarrito.OPEN).length,
      carritosFinalizados: carritos.filter(c => c.estado === EstadoCarrito.CHECKED_OUT).length,
      carritosAbandonados: carritos.filter(c => c.estado === EstadoCarrito.ABANDONED).length,
      carritosBloqueados: carritos.filter(c => c.estado === EstadoCarrito.LOCKED).length,
    };
  }
}
