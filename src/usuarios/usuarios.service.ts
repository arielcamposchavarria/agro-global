// import { Injectable } from '@nestjs/common';
// import { CreateUsuarioDto } from './dto/create-usuario.dto';
// import { UpdateUsuarioDto } from './dto/update-usuario.dto';

// @Injectable()
// export class UsuariosService {
//   create(createUsuarioDto: CreateUsuarioDto) {
//     return 'This action adds a new usuario';
//   }

//   findAll() {
//     return `This action returns all usuarios`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} usuario`;
//   }

//   update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
//     return `This action updates a #${id} usuario`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} usuario`;
//   }
// }
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { QueryUsuariosDto } from './dto/query-usuarios.dto';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private readonly repo: Repository<Usuario>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async create(dto: CreateUsuarioDto) {
    // email único
    const dup = await this.repo.findOne({ where: { email: dto.email } });
    if (dup) throw new ConflictException('El email ya está registrado');

    // rol existente
    const rol = await this.roleRepo.findOne({ where: { id: dto.rolId } });
    if (!rol) throw new NotFoundException('Rol no encontrado');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const entity = this.repo.create({
      rolId: dto.rolId,
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      passwordHash,
      direccion: dto.direccion,
      telefono: dto.telefono,
      estado: dto.estado ?? 'activo',
    });

    const saved = await this.repo.save(entity);
    return this.stripPassword(saved);
  }

  async findAll(q: QueryUsuariosDto) {
    const { page = 1, limit = 15, search, estado, rolId } = q;

    const where: any = {};
    if (estado) where.estado = estado;
    if (rolId) where.rolId = rolId;

    // búsqueda básica
    if (search) {
      Object.assign(where, [
        { ...where, nombre: ILike(`%${search}%`) },
        { ...where, apellido: ILike(`%${search}%`) },
        { ...where, email: ILike(`%${search}%`) },
      ]);
    }

    const [items, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: { rol: true },
      select: {
        // excluye passwordHash (no está seleccionado por defecto)
        id: true, rolId: true, nombre: true, apellido: true, email: true,
        direccion: true, telefono: true, estado: true, createdAt: true, updatedAt: true,
        rol: { id: true, nombre: true },
      },
    });

    return {
      data: items,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({
      where: { id },
      relations: { rol: true },
      select: {
        id: true, rolId: true, nombre: true, apellido: true, email: true,
        direccion: true, telefono: true, estado: true, createdAt: true, updatedAt: true,
        rol: { id: true, nombre: true },
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: string, dto: UpdateUsuarioDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.email && dto.email !== user.email) {
      const dup = await this.repo.findOne({ where: { email: dto.email } });
      if (dup) throw new ConflictException('El email ya está registrado');
    }

    if (dto.rolId) {
      const rol = await this.roleRepo.findOne({ where: { id: dto.rolId } });
      if (!rol) throw new NotFoundException('Rol no encontrado');
      user.rolId = dto.rolId;
    }

    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 12);
    }

    Object.assign(user, {
      nombre: dto.nombre ?? user.nombre,
      apellido: dto.apellido ?? user.apellido,
      email: dto.email ?? user.email,
      direccion: dto.direccion ?? user.direccion,
      telefono: dto.telefono ?? user.telefono,
      estado: dto.estado ?? user.estado,
    });

    const saved = await this.repo.save(user);
    return this.stripPassword(saved);
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.repo.remove(user);
    return { deleted: true };
  }

  /** Helpers */
  private stripPassword(u: Usuario) {
    // como passwordHash tiene select:false, casi nunca viene
    const { passwordHash, ...rest } = u as any;
    return rest;
  }
}
