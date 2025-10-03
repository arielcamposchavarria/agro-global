import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between, MoreThan } from 'typeorm';
import { Oferta, EstadoOferta } from './entities/oferta.entity';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto, UpdateStockDto, UpdatePrecioDto } from './dto/update-oferta.dto';
import { FilterOfertaDto } from './dto/filter-oferta.dto';

@Injectable()
export class OfertasService {
  constructor(
    @InjectRepository(Oferta)
    private ofertasRepository: Repository<Oferta>,
  ) {}

  async create(createOfertaDto: CreateOfertaDto, sellerId: number): Promise<Oferta> {
    // Verificar que el cultivo pertenezca al seller (opcional, dependiendo de tu lógica)
    // Aquí podrías agregar validación adicional

    const oferta = this.ofertasRepository.create({
      ...createOfertaDto,
      sellerId,
    });

    return await this.ofertasRepository.save(oferta);
  }

  async findAll(filterDto: FilterOfertaDto = {}): Promise<{
    data: Oferta[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      conStock,
      activas,
      ...filters
    } = filterDto;

    const skip = (page - 1) * limit;

    let queryBuilder = this.ofertasRepository
      .createQueryBuilder('oferta')
      .leftJoinAndSelect('oferta.seller', 'seller')
      .leftJoinAndSelect('oferta.cultivo', 'cultivo')
      .leftJoinAndSelect('cultivo.categoria', 'categoria');

    // Filtros específicos
    if (filters.sellerId) {
      queryBuilder = queryBuilder.andWhere('oferta.sellerId = :sellerId', { 
        sellerId: filters.sellerId 
      });
    }

    if (filters.cultivoId) {
      queryBuilder = queryBuilder.andWhere('oferta.cultivoId = :cultivoId', { 
        cultivoId: filters.cultivoId 
      });
    }

    if (filters.unidad) {
      queryBuilder = queryBuilder.andWhere('oferta.unidad LIKE :unidad', { 
        unidad: `%${filters.unidad}%` 
      });
    }

    if (filters.estado) {
      queryBuilder = queryBuilder.andWhere('oferta.estado = :estado', { 
        estado: filters.estado 
      });
    }

    // Filtros de precio
    if (filters.precioMin && filters.precioMax) {
      queryBuilder = queryBuilder.andWhere('oferta.precio BETWEEN :precioMin AND :precioMax', {
        precioMin: filters.precioMin,
        precioMax: filters.precioMax,
      });
    } else if (filters.precioMin) {
      queryBuilder = queryBuilder.andWhere('oferta.precio >= :precioMin', { 
        precioMin: filters.precioMin 
      });
    } else if (filters.precioMax) {
      queryBuilder = queryBuilder.andWhere('oferta.precio <= :precioMax', { 
        precioMax: filters.precioMax 
      });
    }

    // Filtro de stock mínimo
    if (filters.stockMin) {
      queryBuilder = queryBuilder.andWhere('oferta.stock >= :stockMin', { 
        stockMin: filters.stockMin 
      });
    }

    // Filtros booleanos
    if (conStock) {
      queryBuilder = queryBuilder.andWhere('oferta.stock > 0');
    }

    if (activas) {
      queryBuilder = queryBuilder.andWhere('oferta.estado = :estadoActivo', { 
        estadoActivo: EstadoOferta.PUBLICADO 
      });
    }

    // Búsqueda general
    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(oferta.comentario LIKE :search OR cultivo.nombre LIKE :search OR cultivo.variedad LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Ordenamiento
    const validSortFields = {
      precio: 'oferta.precio',
      stock: 'oferta.stock',
      createdAt: 'oferta.createdAt',
    };

    if (validSortFields[sortBy]) {
      queryBuilder = queryBuilder.orderBy(validSortFields[sortBy], sortOrder);
    }

    // Paginación
    queryBuilder = queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<Oferta> {
    const oferta = await this.ofertasRepository.findOne({
      where: { id },
      relations: ['seller', 'cultivo', 'cultivo.categoria'],
    });

    if (!oferta) {
      throw new NotFoundException(`Oferta con ID ${id} no encontrada`);
    }

    return oferta;
  }

  async findByUserId(userId: number, filterDto: FilterOfertaDto = {}): Promise<{
    data: Oferta[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.findAll({ ...filterDto, sellerId: userId });
  }

  async update(id: number, updateOfertaDto: UpdateOfertaDto, userId?: number): Promise<Oferta> {
    const oferta = await this.findOne(id);

    // Verificar permisos (opcional)
    if (userId && oferta.sellerId !== userId) {
      throw new ForbiddenException('No tienes permisos para actualizar esta oferta');
    }

    await this.ofertasRepository.update(id, updateOfertaDto);
    return await this.findOne(id);
  }

  async updateStock(id: number, updateStockDto: UpdateStockDto, userId?: number): Promise<Oferta> {
    const oferta = await this.findOne(id);

    if (userId && oferta.sellerId !== userId) {
      throw new ForbiddenException('No tienes permisos para actualizar el stock de esta oferta');
    }

    await this.ofertasRepository.update(id, { stock: updateStockDto.stock });
    return await this.findOne(id);
  }

  async updatePrecio(id: number, updatePrecioDto: UpdatePrecioDto, userId?: number): Promise<Oferta> {
    const oferta = await this.findOne(id);

    if (userId && oferta.sellerId !== userId) {
      throw new ForbiddenException('No tienes permisos para actualizar el precio de esta oferta');
    }

    await this.ofertasRepository.update(id, { precio: updatePrecioDto.precio });
    return await this.findOne(id);
  }

  // Métodos para cambiar estado
  async publish(id: number, userId?: number): Promise<Oferta> {
    const oferta = await this.findOne(id);

    if (userId && oferta.sellerId !== userId) {
      throw new ForbiddenException('No tienes permisos para publicar esta oferta');
    }

    if (oferta.stock <= 0) {
      throw new BadRequestException('No se puede publicar una oferta sin stock');
    }

    await this.ofertasRepository.update(id, { estado: EstadoOferta.PUBLICADO });
    return await this.findOne(id);
  }

  async pause(id: number, userId?: number): Promise<Oferta> {
    const oferta = await this.findOne(id);

    if (userId && oferta.sellerId !== userId) {
      throw new ForbiddenException('No tienes permisos para pausar esta oferta');
    }

    await this.ofertasRepository.update(id, { estado: EstadoOferta.PAUSADO });
    return await this.findOne(id);
  }

  async finalize(id: number, userId?: number): Promise<Oferta> {
    const oferta = await this.findOne(id);

    if (userId && oferta.sellerId !== userId) {
      throw new ForbiddenException('No tienes permisos para finalizar esta oferta');
    }

    await this.ofertasRepository.update(id, { estado: EstadoOferta.FINALIZADO });
    return await this.findOne(id);
  }

  async toggleStatus(id: number, userId?: number): Promise<Oferta> {
    const oferta = await this.findOne(id);

    if (userId && oferta.sellerId !== userId) {
      throw new ForbiddenException('No tienes permisos para cambiar el estado de esta oferta');
    }

    let newStatus: EstadoOferta;
    
    switch (oferta.estado) {
      case EstadoOferta.PUBLICADO:
        newStatus = EstadoOferta.PAUSADO;
        break;
      case EstadoOferta.PAUSADO:
        if (oferta.stock > 0) {
          newStatus = EstadoOferta.PUBLICADO;
        } else {
          throw new BadRequestException('No se puede activar una oferta sin stock');
        }
        break;
      case EstadoOferta.BORRADOR:
        if (oferta.stock > 0) {
          newStatus = EstadoOferta.PUBLICADO;
        } else {
          throw new BadRequestException('No se puede activar una oferta sin stock');
        }
        break;
      default:
        throw new BadRequestException('No se puede cambiar el estado de esta oferta');
    }

    await this.ofertasRepository.update(id, { estado: newStatus });
    return await this.findOne(id);
  }

  async reduceStock(id: number, cantidad: number): Promise<Oferta> {
    const oferta = await this.findOne(id);

    if (oferta.stock < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }

    const newStock = oferta.stock - cantidad;
    await this.ofertasRepository.update(id, { stock: newStock });

    // Auto-pausar si se queda sin stock
    if (newStock === 0 && oferta.estado === EstadoOferta.PUBLICADO) {
      await this.ofertasRepository.update(id, { estado: EstadoOferta.PAUSADO });
    }

    return await this.findOne(id);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const oferta = await this.findOne(id);

    if (userId && oferta.sellerId !== userId) {
      throw new ForbiddenException('No tienes permisos para eliminar esta oferta');
    }

    // Solo permitir eliminar borradores o ofertas finalizadas
    if (![EstadoOferta.BORRADOR, EstadoOferta.FINALIZADO].includes(oferta.estado)) {
      throw new BadRequestException('Solo se pueden eliminar ofertas en borrador o finalizadas');
    }

    await this.ofertasRepository.remove(oferta);
  }

  // Métodos adicionales para estadísticas
  async getStatsByUser(userId: number): Promise<{
    total: number;
    publicadas: number;
    pausadas: number;
    borradores: number;
    finalizadas: number;
    valorTotalStock: number;
  }> {
    const ofertas = await this.ofertasRepository.find({
      where: { sellerId: userId }
    });

    const stats = {
      total: ofertas.length,
      publicadas: ofertas.filter(o => o.estado === EstadoOferta.PUBLICADO).length,
      pausadas: ofertas.filter(o => o.estado === EstadoOferta.PAUSADO).length,
      borradores: ofertas.filter(o => o.estado === EstadoOferta.BORRADOR).length,
      finalizadas: ofertas.filter(o => o.estado === EstadoOferta.FINALIZADO).length,
      valorTotalStock: ofertas.reduce((total, oferta) => total + (oferta.precio * oferta.stock), 0),
    };

    return stats;
  }

  async getGlobalStats(): Promise<{
    total: number;
    publicadas: number;
    conStock: number;
    sinStock: number;
    valorTotalMercado: number;
  }> {
    const ofertas = await this.ofertasRepository.find();

    const stats = {
      total: ofertas.length,
      publicadas: ofertas.filter(o => o.estado === EstadoOferta.PUBLICADO).length,
      conStock: ofertas.filter(o => o.stock > 0).length,
      sinStock: ofertas.filter(o => o.stock === 0).length,
      valorTotalMercado: ofertas
        .filter(o => o.estado === EstadoOferta.PUBLICADO)
        .reduce((total, oferta) => total + (oferta.precio * oferta.stock), 0),
    };

    return stats;
  }
}