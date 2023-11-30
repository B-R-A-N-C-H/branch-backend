import { Test, TestingModule } from '@nestjs/testing';
import { StudentManagementService } from './student-management.service';
import { PrismaService} from '../utils/database/prisma.service';
import { MemberService} from '../member/member.service';

describe('StudentManagementService', () => {
  let service: StudentManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentManagementService, PrismaService, MemberService],
    }).compile();

    service = module.get<StudentManagementService>(StudentManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
