import { Test, TestingModule } from '@nestjs/testing';
import { StudentManagementController } from './student-management.controller';

describe('StudentManagementController', () => {
  let controller: StudentManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentManagementController],
    }).compile();

    controller = module.get<StudentManagementController>(StudentManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
