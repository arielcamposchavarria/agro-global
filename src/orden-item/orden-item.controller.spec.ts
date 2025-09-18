import { Test, TestingModule } from '@nestjs/testing';
import { OrdenItemController } from './orden-item.controller';
import { OrdenItemService } from './orden-item.service';

describe('OrdenItemController', () => {
  let controller: OrdenItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenItemController],
      providers: [OrdenItemService],
    }).compile();

    controller = module.get<OrdenItemController>(OrdenItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
