import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationService } from './communication.service';
import { PrismaService } from "../utils/database/prisma.service";
import { MemberService } from '../member/member.service';

describe('CommunicationService', () => {
  let service: CommunicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunicationService, PrismaService, MemberService],
    }).compile();

    service = module.get<CommunicationService>(CommunicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
