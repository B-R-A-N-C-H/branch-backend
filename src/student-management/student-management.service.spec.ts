import { Test, TestingModule } from '@nestjs/testing';
import { StudentManagementService } from './student-management.service';

describe('StudentManagementService', () => {
  let service: StudentManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentManagementService],
    }).compile();

    service = module.get<StudentManagementService>(StudentManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
