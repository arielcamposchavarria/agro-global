import { Injectable } from '@nestjs/common';
import { CreateOrdenItemDto } from './dto/create-orden-item.dto';
import { UpdateOrdenItemDto } from './dto/update-orden-item.dto';

@Injectable()
export class OrdenItemService {
  create(createOrdenItemDto: CreateOrdenItemDto) {
    return 'This action adds a new ordenItem';
  }

  findAll() {
    return `This action returns all ordenItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordenItem`;
  }

  update(id: number, updateOrdenItemDto: UpdateOrdenItemDto) {
    return `This action updates a #${id} ordenItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordenItem`;
  }
}
