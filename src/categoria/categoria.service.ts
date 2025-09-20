// import { Injectable } from '@nestjs/common';
// import { CreateCategoriaDto } from './dto/create-categoria.dto';
// import { UpdateCategoriaDto } from './dto/update-categoria.dto';

// @Injectable()
// export class CategoriaService {
//   create(createCategoriaDto: CreateCategoriaDto) {
//     return 'This action adds a new categoria';
//   }

//   findAll() {
//     return `This action returns all categoria`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} categoria`;
//   }

//   update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
//     return `This action updates a #${id} categoria`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} categoria`;
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repo: Repository<Categoria>,
  ) {}

  create(dto: CreateCategoriaDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Categoría no encontrada');
    return found;
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    const cat = await this.findOne(id);
    Object.assign(cat, dto);
    return this.repo.save(cat);
  }

  async remove(id: number) {
    const cat = await this.findOne(id);
    await this.repo.remove(cat);
    return { deleted: true };
  }
}
