import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationController } from './communication.controller';

describe('CommunicationController', () => {
  let controller: CommunicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunicationController],
    }).compile();

    controller = module.get<CommunicationController>(CommunicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
