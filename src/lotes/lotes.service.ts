// import { Injectable } from '@nestjs/common';
// import { CreateLoteDto } from './dto/create-lote.dto';
// import { UpdateLoteDto } from './dto/update-lote.dto';

// @Injectable()
// export class LotesService {
//   create(createLoteDto: CreateLoteDto) {
//     return 'This action adds a new lote';
//   }

//   findAll() {
//     return `This action returns all lotes`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} lote`;
//   }

//   update(id: number, updateLoteDto: UpdateLoteDto) {
//     return `This action updates a #${id} lote`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} lote`;
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lote } from './entities/lote.entity';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lote) private readonly repo: Repository<Lote>,
    @InjectRepository(Usuario) private readonly userRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateLoteDto) {
    const agricultor = await this.userRepo.findOne({ where: { id: dto.agricultor_id } });
    if (!agricultor) throw new NotFoundException('Agricultor no encontrado');

    const lote = this.repo.create({
      nombre: dto.nombre,
      areaHa: dto.area_ha,
      ubicacion: dto.ubicacion,
      notas: dto.notas,
      agricultor,
    });
    return this.repo.save(lote);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Lote no encontrado');
    return found;
  }

  async update(id: number, dto: UpdateLoteDto) {
    const lote = await this.findOne(id);

    if (dto.agricultor_id) {
      const agricultor = await this.userRepo.findOne({ where: { id: dto.agricultor_id } });
      if (!agricultor) throw new NotFoundException('Agricultor no encontrado');
      lote.agricultor = agricultor;
    }

    Object.assign(lote, {
      nombre: dto.nombre ?? lote.nombre,
      areaHa: dto.area_ha ?? lote.areaHa,
      ubicacion: dto.ubicacion ?? lote.ubicacion,
      notas: dto.notas ?? lote.notas,
    });

    return this.repo.save(lote);
  }

  async remove(id: number) {
    const lote = await this.findOne(id);
    await this.repo.remove(lote);
    return { deleted: true };
  }
}
