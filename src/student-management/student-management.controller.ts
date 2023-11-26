import { Controller, Get } from '@nestjs/common';
import { StudentManagementService } from './student-management.service';

@Controller('student-management')
export class StudentManagementController {

  constructor(private StudentManagementService: StudentManagementService) {}

  @Get()
  async GetAllStudents() {
    return this.StudentManagementService.GetAllStudents();
  }

}
