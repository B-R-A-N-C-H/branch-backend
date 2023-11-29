import { Body, Controller, Get, Param } from '@nestjs/common';
import { StudentManagementService } from './student-management.service';
import { UpdateStudentDto } from './dto/student-management.dto';
import Protected from '../auth/guards/protected.decorator';
import { Role } from '@prisma/client';

@Controller('students')
export class StudentManagementController {

    constructor(private StudentManagementService: StudentManagementService) {
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER, Role.TEACHER)
    @Get()
    async GetAllStudents() {
        return this.StudentManagementService.getAllStudents();
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER, Role.TEACHER)
    @Get(':id')
    async GetStudentById(@Param('id') id: string) {
        return this.StudentManagementService.getStudentById(id);
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER)
    @Get()
    async UpdateStudent(@Param(':id') id: string, updateStudent: UpdateStudentDto) {
        return this.StudentManagementService.updateStudent(id, updateStudent);
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER)
    @Get(':id')
    async DeleteStudent(@Param('id') id: string) {
        return this.StudentManagementService.deleteStudent(id);
    }
}