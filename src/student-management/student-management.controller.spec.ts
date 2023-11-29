import { Test, TestingModule } from '@nestjs/testing';
import { StudentManagementController } from './student-management.controller';
import { JwtService} from '@nestjs/jwt';
import { ConfigService} from '@nestjs/config';
import { PrismaService } from '../utils/database/prisma.service';
import { StudentManagementService} from './student-management.service';
import { MemberService} from '../member/member.service';

describe('StudentManagementController', () => {
  let controller: StudentManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentManagementController],
      providers: [JwtService, ConfigService, StudentManagementService, PrismaService, MemberService]
    }).compile();

    controller = module.get<StudentManagementController>(StudentManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
