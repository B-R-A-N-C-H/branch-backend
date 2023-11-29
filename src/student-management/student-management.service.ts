import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../utils/database/prisma.service';
import { Student } from '@prisma/client';
import { UpdateStudentDto } from './dto/student-management.dto';


@Injectable()
export class StudentManagementService {

    constructor(private Prisma: PrismaService) {
    }

    async getAllStudents() {
        return this.Prisma.student.findMany();
    }

    async getStudentById(studentId: string) {
        const student = await this.Prisma.student.findUnique({
            where: {
                id: studentId,
            },
        });

        if (!student)
            throw new NotFoundException(`There is no student with ID: ${studentId}`);

        return student
    }


    async deleteStudent(studentId: string) {
        const student = await this.Prisma.student.findUnique({
            where: {
                id: studentId,
            },
        });

        if (!student)
            throw new NotFoundException(`There is no student with ID: ${studentId}`);


        return this.Prisma.student.delete({
            where: {
                id: studentId,
            },
        });

    }


    async updateStudent(studentId: string, dataTransObj: UpdateStudentDto) {
        const student = await this.Prisma.student.findUnique({
            where: {
                id: studentId,
            },
        });

        if (!student) {
            throw new NotFoundException('student not found');
        }


        return this.Prisma.student.update({
            where: {
                id: studentId,
            },
            data: dataTransObj,
        });
    }
}




