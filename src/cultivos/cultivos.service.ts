// import { Injectable } from '@nestjs/common';
// import { CreateCultivoDto } from './dto/create-cultivo.dto';
// import { UpdateCultivoDto } from './dto/update-cultivo.dto';

// @Injectable()
// export class CultivosService {
//   create(createCultivoDto: CreateCultivoDto) {
//     return 'This action adds a new cultivo';
//   }

//   findAll() {
//     return `This action returns all cultivos`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} cultivo`;
//   }

//   update(id: number, updateCultivoDto: UpdateCultivoDto) {
//     return `This action updates a #${id} cultivo`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} cultivo`;
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
import { Categoria } from '../categoria/entities/categoria.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class CultivosService {
  constructor(
    @InjectRepository(Cultivo) private readonly repo: Repository<Cultivo>,
    @InjectRepository(Categoria) private readonly catRepo: Repository<Categoria>,
    @InjectRepository(Usuario) private readonly userRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateCultivoDto) {
    const agricultor = await this.userRepo.findOne({ where: { id: Number(dto.agricultor_id) } });
    if (!agricultor) throw new NotFoundException('Agricultor no encontrado');

    const categoria = await this.catRepo.findOne({ where: { id: dto.categoria_id } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    const entity = this.repo.create({
      nombre: dto.nombre,
      variedad: dto.variedad,
      estado: dto.estado, // si no viene, TypeORM usa el default "pendiente"
      notas: dto.notas,
      agricultor,
      categoria,
    });

    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Cultivo no encontrado');
    return found;
  }

  async update(id: number, dto: UpdateCultivoDto) {
    const cultivo = await this.findOne(id);

    if (dto.agricultor_id) {
      const agricultor = await this.userRepo.findOne({ where: { id: Number(dto.agricultor_id) } });
      if (!agricultor) throw new NotFoundException('Agricultor no encontrado');
      cultivo.agricultor = agricultor;
    }

    if (dto.categoria_id) {
      const categoria = await this.catRepo.findOne({ where: { id: dto.categoria_id } });
      if (!categoria) throw new NotFoundException('Categoría no encontrada');
      cultivo.categoria = categoria;
    }

    Object.assign(cultivo, {
      nombre: dto.nombre ?? cultivo.nombre,
      variedad: dto.variedad ?? cultivo.variedad,
      estado: dto.estado ?? cultivo.estado,
      notas: dto.notas ?? cultivo.notas,
    });

    return this.repo.save(cultivo);
  }

  async remove(id: number) {
    const cultivo = await this.findOne(id);
    await this.repo.remove(cultivo);
    return { deleted: true };
  }
}
