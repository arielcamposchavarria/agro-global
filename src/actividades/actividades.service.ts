// import { Injectable } from '@nestjs/common';
// import { CreateActividadeDto } from './dto/create-actividade.dto';
// import { UpdateActividadeDto } from './dto/update-actividade.dto';

// @Injectable()
// export class ActividadesService {
//   create(createActividadeDto: CreateActividadeDto) {
//     return 'This action adds a new actividade';
//   }

//   findAll() {
//     return `This action returns all actividades`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} actividade`;
//   }

//   update(id: number, updateActividadeDto: UpdateActividadeDto) {
//     return `This action updates a #${id} actividade`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} actividade`;
//   }
// }
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from './entities/actividade.entity';
import { CreateActividadDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';
import { Cultivo } from '../cultivos/entities/cultivo.entity';
import { Lote } from '../lotes/entities/lote.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad) private readonly repo: Repository<Actividad>,
    @InjectRepository(Cultivo) private readonly cultivoRepo: Repository<Cultivo>,
    @InjectRepository(Lote) private readonly loteRepo: Repository<Lote>,
  @InjectRepository(Usuario) private readonly userRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateActividadDto) {
    const agricultor = await this.userRepo.findOne({ where: { id: dto.agricultor_id } });
    if (!agricultor) throw new NotFoundException('Agricultor no encontrado');

    const cultivo = await this.cultivoRepo.findOne({ where: { id: dto.cultivo_id } });
    if (!cultivo) throw new NotFoundException('Cultivo no encontrado');

    const lote = await this.loteRepo.findOne({ where: { id: dto.lote_id } });
    if (!lote) throw new NotFoundException('Lote no encontrado');

    // 🔒 (Opcional pero recomendado) Consistencia: el agricultor debe coincidir
    if (cultivo.agricultor?.id !== agricultor.id || lote.agricultor?.id !== agricultor.id) {
      throw new BadRequestException('El agricultor de la actividad debe coincidir con el del cultivo y el lote');
    }

    const actividad = this.repo.create({
      agricultor,
      cultivo,
      tipo: dto.tipo,
      detalle: dto.detalle,
      lote,
      cantidad: dto.cantidad,
      unidad: dto.unidad,
      fechaInicio: new Date(dto.fechaInicio),
      fechaFinal: dto.fechaFinal ? new Date(dto.fechaFinal) : undefined,
      notas: dto.notas,
    });

    return this.repo.save(actividad);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Actividad no encontrada');
    return found;
  }

  async update(id: number, dto: UpdateActividadeDto) {
    const actividad = await this.findOne(id);

    if (dto.agricultor_id) {
      const agricultor = await this.userRepo.findOne({ where: { id: dto.agricultor_id } });
      if (!agricultor) throw new NotFoundException('Agricultor no encontrado');
      actividad.agricultor = agricultor;
    }
    if (dto.cultivo_id) {
      const cultivo = await this.cultivoRepo.findOne({ where: { id: dto.cultivo_id } });
      if (!cultivo) throw new NotFoundException('Cultivo no encontrado');
      actividad.cultivo = cultivo;
    }
    if (dto.lote_id) {
      const lote = await this.loteRepo.findOne({ where: { id: dto.lote_id } });
      if (!lote) throw new NotFoundException('Lote no encontrado');
      actividad.lote = lote;
    }

    // 🔒 (Opcional) revalidar coherencia si cambiaron campos relacionados
    if (dto.agricultor_id || dto.cultivo_id || dto.lote_id) {
      const agId = actividad.agricultor.id;
      if (actividad.cultivo.agricultor?.id !== agId || actividad.lote.agricultor?.id !== agId) {
        throw new BadRequestException('El agricultor debe coincidir con el del cultivo y el lote');
      }
    }

    Object.assign(actividad, {
      tipo: dto.tipo ?? actividad.tipo,
      detalle: dto.detalle ?? actividad.detalle,
      cantidad: dto.cantidad ?? actividad.cantidad,
      unidad: dto.unidad ?? actividad.unidad,
      fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : actividad.fechaInicio,
      fechaFinal: dto.fechaFinal ? new Date(dto.fechaFinal) : actividad.fechaFinal,
      notas: dto.notas ?? actividad.notas,
    });

    return this.repo.save(actividad);
  }

  async remove(id: number) {
    const actividad = await this.findOne(id);
    await this.repo.remove(actividad);
    return { deleted: true };
  }
}