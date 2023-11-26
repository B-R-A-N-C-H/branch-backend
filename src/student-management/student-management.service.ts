import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utils/database/prisma.service';


@Injectable()
export class StudentManagementService {

  constructor(private Prisma: PrismaService) {

  }

  async GetAllStudents() {
    return this.Prisma.student.findMany();
  }

}
