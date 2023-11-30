import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { StudentManagementService } from './student-management.service';
import { UpdateStudentDto } from './dto/student-management.dto';
import Protected from '../auth/guards/protected.decorator';
import { Role } from '@prisma/client';
import { AuthenticatedUser } from '../auth/guards/auth-user.decorator';
import { JwtPayload } from '../auth/dto/auth.dto';

@Controller('students')
export class StudentManagementController {

    constructor(private StudentManagementService: StudentManagementService) {
    }

    @Protected()
    @Get()
    async GetAllStudents(@AuthenticatedUser() user: JwtPayload) {
        return this.StudentManagementService.getAllStudents(user);
    }

    @Protected()
    @Get(':id')
    async GetStudentById(@AuthenticatedUser() user: JwtPayload, @Param('id') id: string) {
        return this.StudentManagementService.getStudentById(id, user);
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER)
    @Patch(':id')
    async UpdateStudent(@Param('id') id: string, @Body() updateStudent: UpdateStudentDto) {
        return this.StudentManagementService.updateStudent(id, updateStudent);
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER)
    @Delete(':id')
    async DeleteStudent(@Param('id') id: string) {
        return this.StudentManagementService.deleteStudent(id);
    }
}