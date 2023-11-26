import { Body, Controller, Get, Param } from '@nestjs/common';
import { StudentManagementService } from './student-management.service';
import { UpdateStudentDto } from './dto/student-management.dto';

@Controller('student-management')
export class StudentManagementController {

  constructor(private StudentManagementService: StudentManagementService) {
  }

  @Get()
  async GetAllStudents() {
    return this.StudentManagementService.GetAllStudents();
  }


  @Get(":id")
  async GetStudentById(@Param('id') id: string) {
    return this.StudentManagementService.GetStudentById(id);
  }

  @Get()
  async UpdateStudent(@Param(":id") id: string, updateStudent: UpdateStudentDto)  {
    return this.StudentManagementService.UpdateStudent(id,updateStudent);

  }


  @Get(":id")
  async DeleteStudent(@Param("id") id: string) {
    return this.StudentManagementService.DeleteStudent(id);
  }





}