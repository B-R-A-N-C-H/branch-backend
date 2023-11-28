import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../utils/database/prisma.service';
import { Student } from '@prisma/client';
import { UpdateStudentDto } from './dto/student-management.dto';


@Injectable()
export class StudentManagementService {

  constructor(private Prisma: PrismaService) {

  }

  async GetAllStudents() {
    return this.Prisma.student.findMany();
  }

  async GetStudentById(studentId: string) {
    const student = await this.Prisma.student.findUnique( {
      where: {
        id : studentId
      }
    })

    if (student) {
      return student;
    }
    else {
       throw new NotFoundException("Student not found!");
    }
  }


  async DeleteStudent(studentId: string) {
    const student = await this.Prisma.student.findUnique({
      where: {
        id: studentId
      }
    });

    if (!studentId) {
      throw new NotFoundException('student not found');
    }

    return this.Prisma.student.delete( {
      where: {
        id : studentId
      }
    });

  }




  async UpdateStudent(studentId: string, dataTransObj: UpdateStudentDto) {
    const student = await this.Prisma.student.findUnique({
        where: {
          id: studentId
        }
      });

      if (!studentId) {
        throw new NotFoundException('student not found');
      }


      return this.Prisma.student.update({
        where: {
          id: studentId
        },
        data: dataTransObj
    })
  }



}




