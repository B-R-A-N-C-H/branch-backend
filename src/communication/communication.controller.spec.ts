import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationController } from './communication.controller';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../utils/database/prisma.service";
import { CommunicationService } from "./communication.service";
import { MemberService } from '../member/member.service';

describe('CommunicationController', () => {
  let controller: CommunicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunicationController],
      providers: [JwtService, ConfigService, CommunicationService, PrismaService, MemberService]
    }).compile();

    controller = module.get<CommunicationController>(CommunicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
