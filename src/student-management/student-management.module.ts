import { Module } from '@nestjs/common';
import { StudentManagementController } from './student-management.controller';
import { StudentManagementService } from './student-management.service';
import { PrismaService } from '../utils/database/prisma.service';

@Module({
  controllers: [StudentManagementController],
  providers: [StudentManagementService, PrismaService]

})
export class StudentManagementModule {}
