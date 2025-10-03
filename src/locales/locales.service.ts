import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Locale } from './entities/locale.entity';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import { FilterLocaleDto } from './dto/filter-locale.dto';

@Injectable()
export class LocalesService {
  constructor(
    @InjectRepository(Locale)
    private localesRepository: Repository<Locale>,
  ) {}

  async create(createLocaleDto: CreateLocaleDto): Promise<Locale> {
    // Verificar si ya existe un local con el mismo nombre
    if (createLocaleDto.nombre) {
      const existingLocal = await this.localesRepository.findOne({
        where: { nombre: createLocaleDto.nombre }
      });

      if (existingLocal) {
        throw new ConflictException('Ya existe un local con ese nombre');
      }
    }

    // Verificar si ya existe un local con el mismo email (si se proporciona)
    if (createLocaleDto.email) {
      const existingEmail = await this.localesRepository.findOne({
        where: { email: createLocaleDto.email }
      });

      if (existingEmail) {
        throw new ConflictException('Ya existe un local con ese email');
      }
    }

    const locale = this.localesRepository.create(createLocaleDto);
    return await this.localesRepository.save(locale);
  }

  async findAll(filterDto: FilterLocaleDto = {}): Promise<{
    data: Locale[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, search, ...filters } = filterDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Locale> = {};

    // Aplicar filtros específicos
    if (filters.nombre) {
      where.nombre = Like(`%${filters.nombre}%`);
    }
    if (filters.email) {
      where.email = Like(`%${filters.email}%`);
    }
    if (filters.telefono) {
      where.telefono = filters.telefono;
    }
    if (filters.localidad) {
      where.localidad = Like(`%${filters.localidad}%`);
    }
    if (filters.direccion) {
      where.direccion = Like(`%${filters.direccion}%`);
    }
    if (filters.estado) {
      where.estado = filters.estado;
    }

    let queryBuilder = this.localesRepository.createQueryBuilder('locale');

    // Aplicar filtros específicos
    Object.keys(where).forEach(key => {
      if (where[key]) {
        if (typeof where[key] === 'object' && where[key].value) {
          // Para LIKE queries
          queryBuilder = queryBuilder.andWhere(`locale.${key} LIKE :${key}`, { [key]: where[key].value });
        } else {
          // Para exact matches
          queryBuilder = queryBuilder.andWhere(`locale.${key} = :${key}`, { [key]: where[key] });
        }
      }
    });

    // Búsqueda general
    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(locale.nombre LIKE :search OR locale.email LIKE :search OR locale.localidad LIKE :search OR locale.direccion LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Paginación y ordenamiento
    queryBuilder = queryBuilder
      .orderBy('locale.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

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

  async findOne(id: number): Promise<Locale> {
    const locale = await this.localesRepository.findOne({
      where: { id }
    });

    if (!locale) {
      throw new NotFoundException(`Local con ID ${id} no encontrado`);
    }

    return locale;
  }

  async update(id: number, updateLocaleDto: UpdateLocaleDto): Promise<Locale> {
    const locale = await this.findOne(id);

    // Verificar duplicados solo si se está actualizando el campo
    if (updateLocaleDto.nombre && updateLocaleDto.nombre !== locale.nombre) {
      const existingLocal = await this.localesRepository.findOne({
        where: { nombre: updateLocaleDto.nombre }
      });

      if (existingLocal && existingLocal.id !== id) {
        throw new ConflictException('Ya existe un local con ese nombre');
      }
    }

    if (updateLocaleDto.email && updateLocaleDto.email !== locale.email) {
      const existingEmail = await this.localesRepository.findOne({
        where: { email: updateLocaleDto.email }
      });

      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictException('Ya existe un local con ese email');
      }
    }

    await this.localesRepository.update(id, updateLocaleDto);
    return await this.findOne(id);
  }

  async toggleStatus(id: number): Promise<Locale> {
    const locale = await this.findOne(id);
    
    const newStatus = locale.estado === 'activo' ? 'inactivo' : 'activo';
    await this.localesRepository.update(id, { estado: newStatus });
    
    return await this.findOne(id);
  }

  async activate(id: number): Promise<Locale> {
    await this.localesRepository.update(id, { estado: 'activo' });
    return await this.findOne(id);
  }

  async deactivate(id: number): Promise<Locale> {
    await this.localesRepository.update(id, { estado: 'inactivo' });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const locale = await this.findOne(id);
    await this.localesRepository.remove(locale);
  }

  // Método adicional para obtener estadísticas
  async getStats(): Promise<{
    total: number;
    activos: number;
    inactivos: number;
  }> {
    const total = await this.localesRepository.count();
    const activos = await this.localesRepository.count({ where: { estado: 'activo' } });
    const inactivos = await this.localesRepository.count({ where: { estado: 'inactivo' } });

    return { total, activos, inactivos };
  }
}
