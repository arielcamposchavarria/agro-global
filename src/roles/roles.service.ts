// import { Injectable } from '@nestjs/common';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';

// @Injectable()
// export class RolesService {
//   create(createRoleDto: CreateRoleDto) {
//     return 'This action adds a new role';
//   }

//   findAll() {
//     return `This action returns all roles`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} role`;
//   }

//   update(id: number, updateRoleDto: UpdateRoleDto) {
//     return `This action updates a #${id} role`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} role`;
//   }
// }
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}

  async create(dto: CreateRoleDto) {
    const exists = await this.repo.findOne({ where: { nombre: dto.nombre } });
    if (exists) throw new ConflictException('El nombre de rol ya existe');
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Rol no encontrado');
    return role;
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (dto.nombre && dto.nombre !== role.nombre) {
      const dup = await this.repo.findOne({ where: { nombre: dto.nombre } });
      if (dup) throw new ConflictException('El nombre de rol ya existe');
    }
    Object.assign(role, dto);
    return this.repo.save(role);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    await this.repo.remove(role);
    return { deleted: true };
  }
}
