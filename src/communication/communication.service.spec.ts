import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationService } from './communication.service';
import { PrismaService } from "../utils/database/prisma.service";

describe('CommunicationService', () => {
  let service: CommunicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunicationService, PrismaService],
    }).compile();

    service = module.get<CommunicationService>(CommunicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
