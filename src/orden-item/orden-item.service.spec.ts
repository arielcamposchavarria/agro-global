import { Test, TestingModule } from '@nestjs/testing';
import { OrdenItemService } from './orden-item.service';

describe('OrdenItemService', () => {
  let service: OrdenItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdenItemService],
    }).compile();

    service = module.get<OrdenItemService>(OrdenItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
