import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdenItemDto } from './create-orden-item.dto';

export class UpdateOrdenItemDto extends PartialType(CreateOrdenItemDto) {}
