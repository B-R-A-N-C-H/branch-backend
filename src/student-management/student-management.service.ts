import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../utils/database/prisma.service';
import { Student } from '@prisma/client';
import { UpdateStudentDto } from './dto/student-management.dto';
import { JwtPayload } from '../auth/dto/auth.dto';


@Injectable()
export class StudentManagementService {

    constructor(private prisma: PrismaService) {
    }

    async getAllStudents(user: JwtPayload) {
        return this.prisma.student.findMany({
            where: user.sub.role === null ? {
                parentId: user.sub.id
            } : undefined
        });
    }

    async getStudentById(studentId: string, user: JwtPayload) {
        const student = await this.prisma.student.findUnique({
            where: {
                id: studentId,
                parentId: user.sub.id
            },
            include: {
                parent: true,
            },
        });

        if (!student)
            throw new NotFoundException(`There is no student with ID: ${studentId}`);

        return student;
    }


    async deleteStudent(studentId: string) {
        const student = await this.prisma.student.findUnique({
            where: {
                id: studentId,
            },
        });

        if (!student)
            throw new NotFoundException(`There is no student with ID: ${studentId}`);


        return this.prisma.student.delete({
            where: {
                id: studentId,
            },
        });

    }


    async updateStudent(studentId: string, dataTransObj: UpdateStudentDto) {
        const student = await this.prisma.student.findUnique({
            where: {
                id: studentId,
            },
        });

        if (!student) {
            throw new NotFoundException('student not found');
        }


        return this.prisma.student.update({
            where: {
                id: studentId,
            },
            data: dataTransObj,
        });
    }
}




