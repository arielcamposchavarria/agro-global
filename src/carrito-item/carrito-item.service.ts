import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarritoItem } from './entities/carrito-item.entity';
import { CreateCarritoItemDto } from './dto/create-carrito-item.dto';
import { UpdateCarritoItemDto } from './dto/update-carrito-item.dto';
import { BulkUpdateCarritoItemDto } from './dto/bulk-update-carrito-item.dto';
import { CarritoService } from '../carrito/carrito.service';
import { OfertasService } from '../ofertas/ofertas.service';
import { EstadoCarrito } from '../carrito/entities/carrito.entity';

@Injectable()
export class CarritoItemService {
  constructor(
    @InjectRepository(CarritoItem)
    private carritoItemRepository: Repository<CarritoItem>,
    private carritoService: CarritoService,
    private ofertasService: OfertasService,
  ) {}

  async addItem(userId: number, createItemDto: CreateCarritoItemDto): Promise<CarritoItem> {
    // Obtener o crear carrito activo
    const carrito = await this.carritoService.getOrCreateActiveCart(userId);

    if (!carrito.isActive) {
      throw new BadRequestException('No se pueden agregar items a un carrito cerrado');
    }

    // Validar que la oferta existe y está disponible
    const oferta = await this.ofertasService.findOne(createItemDto.ofertaId);
    
    if (!oferta.isAvailable) {
      throw new BadRequestException('La oferta no está disponible');
    }

    if (oferta.stock < createItemDto.qty) {
      throw new BadRequestException(`Stock insuficiente. Disponible: ${oferta.stock}`);
    }

    // Verificar si el item ya existe en el carrito
    const existingItem = await this.carritoItemRepository.findOne({
      where: { 
        cartId: carrito.id, 
        ofertaId: createItemDto.ofertaId 
      }
    });

    if (existingItem) {
      // Actualizar cantidad del item existente
      const newQty = Number(existingItem.qty) + Number(createItemDto.qty);
      
      if (newQty > oferta.stock) {
        throw new BadRequestException(`Stock insuficiente. Disponible: ${oferta.stock}, total solicitado: ${newQty}`);
      }

      return await this.updateItemQty(existingItem.id, { qty: newQty }, userId);
    } else {
      // Crear nuevo item
      const newItem = this.carritoItemRepository.create({
        cartId: carrito.id,
        ofertaId: createItemDto.ofertaId,
        qty: createItemDto.qty,
        precioUnit: oferta.precio,
        tituloSnapshot: this.generateTitleSnapshot(oferta),
        unidadSnapshot: oferta.unidad,
      });

      return await this.carritoItemRepository.save(newItem);
    }
  }

  async findAllByCartId(cartId: number): Promise<CarritoItem[]> {
    return await this.carritoItemRepository.find({
      where: { cartId },
      relations: ['oferta', 'oferta.cultivo'],
      order: { createdAt: 'ASC' },
    });
  }

  async findAllByUserId(userId: number): Promise<CarritoItem[]> {
    const carrito = await this.carritoService.getOrCreateActiveCart(userId);
    return await this.findAllByCartId(carrito.id);
  }

  async findOne(id: number): Promise<CarritoItem> {
    const item = await this.carritoItemRepository.findOne({
      where: { id },
      relations: ['carrito', 'carrito.user', 'oferta', 'oferta.cultivo'],
    });

    if (!item) {
      throw new NotFoundException(`Item del carrito con ID ${id} no encontrado`);
    }

    return item;
  }

  async updateItemQty(id: number, updateItemDto: UpdateCarritoItemDto, userId?: number): Promise<CarritoItem> {
    const item = await this.findOne(id);

    // Verificar permisos
    if (userId && item.carrito.userId !== userId) {
      throw new ForbiddenException('No tienes permisos para actualizar este item');
    }

    if (!item.carrito.isActive) {
      throw new BadRequestException('No se pueden modificar items de un carrito cerrado');
    }

    // Validar stock disponible
    const ofertaActual = await this.ofertasService.findOne(item.ofertaId);
    if (updateItemDto.qty > ofertaActual.stock) {
      throw new BadRequestException(`Stock insuficiente. Disponible: ${ofertaActual.stock}`);
    }

    // Actualizar precio si ha cambiado (opcional)
    const updateData: any = { qty: updateItemDto.qty };
    if (ofertaActual.precio !== Number(item.precioUnit)) {
      updateData.precioUnit = ofertaActual.precio;
    }

    await this.carritoItemRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async bulkUpdateItems(userId: number, bulkUpdateDto: BulkUpdateCarritoItemDto): Promise<CarritoItem[]> {
    const carrito = await this.carritoService.getOrCreateActiveCart(userId);

    if (!carrito.isActive) {
      throw new BadRequestException('No se pueden modificar items de un carrito cerrado');
    }

    const updatedItems: CarritoItem[] = [];

    for (const itemUpdate of bulkUpdateDto.items) {
      const item = await this.findOne(itemUpdate.itemId);
      
      // Verificar que el item pertenece al carrito del usuario
      if (item.cartId !== carrito.id) {
        throw new BadRequestException(`El item ${itemUpdate.itemId} no pertenece a tu carrito activo`);
      }

      // Validar stock
      const oferta = await this.ofertasService.findOne(item.ofertaId);
      if (itemUpdate.qty > oferta.stock) {
        throw new BadRequestException(`Stock insuficiente para ${item.tituloSnapshot}. Disponible: ${oferta.stock}`);
      }

      await this.carritoItemRepository.update(itemUpdate.itemId, { qty: itemUpdate.qty });
      const updatedItem = await this.findOne(itemUpdate.itemId);
      updatedItems.push(updatedItem);
    }

    return updatedItems;
  }

  async removeItem(id: number, userId?: number): Promise<void> {
    const item = await this.findOne(id);

    // Verificar permisos
    if (userId && item.carrito.userId !== userId) {
      throw new ForbiddenException('No tienes permisos para eliminar este item');
    }

    if (!item.carrito.isActive) {
      throw new BadRequestException('No se pueden modificar items de un carrito cerrado');
    }

    await this.carritoItemRepository.remove(item);
  }

  async clearCartItems(userId: number): Promise<void> {
    const carrito = await this.carritoService.getOrCreateActiveCart(userId);

    if (!carrito.isActive) {
      throw new BadRequestException('No se puede vaciar un carrito cerrado');
    }

    await this.carritoItemRepository.delete({ cartId: carrito.id });
  }

  async getCartSummary(userId: number): Promise<{
    items: CarritoItem[];
    totalItems: number;
    totalAmount: number;
    hasInvalidItems: boolean;
    invalidItems: CarritoItem[];
  }> {
    const items = await this.findAllByUserId(userId);
    
    const totalItems = items.reduce((total, item) => total + Number(item.qty), 0);
    const totalAmount = items.reduce((total, item) => total + item.subtotal, 0);
    
    const invalidItems = items.filter(item => !item.isValidStock);
    const hasInvalidItems = invalidItems.length > 0;

    return {
      items,
      totalItems,
      totalAmount,
      hasInvalidItems,
      invalidItems,
    };
  }

  async validateCartStock(userId: number): Promise<{
    isValid: boolean;
    invalidItems: Array<{
      item: CarritoItem;
      requestedQty: number;
      availableStock: number;
    }>;
  }> {
    const items = await this.findAllByUserId(userId);
    const invalidItems = [];

    for (const item of items) {
      const oferta = await this.ofertasService.findOne(item.ofertaId);
      if (Number(item.qty) > Number(oferta.stock)) {
        invalidItems.push({
          item,
          requestedQty: Number(item.qty),
          availableStock: Number(oferta.stock),
        });
      }
    }

    return {
      isValid: invalidItems.length === 0,
      invalidItems,
    };
  }

  async syncPrices(userId: number): Promise<CarritoItem[]> {
    const items = await this.findAllByUserId(userId);
    const updatedItems: CarritoItem[] = [];

    for (const item of items) {
      const oferta = await this.ofertasService.findOne(item.ofertaId);
      
      if (Number(oferta.precio) !== Number(item.precioUnit)) {
        await this.carritoItemRepository.update(item.id, { 
          precioUnit: oferta.precio 
        });
        const updatedItem = await this.findOne(item.id);
        updatedItems.push(updatedItem);
      }
    }

    return updatedItems;
  }

  // Método privado para generar el título snapshot
  private generateTitleSnapshot(oferta: any): string {
    const parts = [oferta.cultivo?.nombre || 'Producto'];
    if (oferta.cultivo?.variedad) {
      parts.push(oferta.cultivo.variedad);
    }
    return parts.join(' - ').substring(0, 140);
  }

  // Métodos para estadísticas
  async getItemStats(userId: number): Promise<{
    totalItems: number;
    uniqueProducts: number;
    totalValue: number;
    averageItemValue: number;
  }> {
    const items = await this.findAllByUserId(userId);

    const totalItems = items.reduce((total, item) => total + Number(item.qty), 0);
    const uniqueProducts = items.length;
    const totalValue = items.reduce((total, item) => total + item.subtotal, 0);
    const averageItemValue = uniqueProducts > 0 ? totalValue / uniqueProducts : 0;

    return {
      totalItems,
      uniqueProducts,
      totalValue,
      averageItemValue,
    };
  }
}