import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../models/StudentModel';
import { Student } from '@prisma/client';

@Controller('students')
export class StudentController {
  constructor() {}

  @Get()
  async getAllStudentsHandler() {
    try {
      const students = await getAllStudents();
      return { data: students, message: 'Students retrieved successfully' };
    } catch (error) {
      return { error: 'Failed to fetch students', message: error.message };
    }
  }

  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    try {
      const student = await getStudentById(id);
      return { data: student, message: 'Student retrieved successfully' };
    } catch (error) {
      return { error: 'Failed to fetch student', message: error.message };
    }
  }

  @Put(':id')
  async updateStudent(@Param('id') id: string, @Body() updatedData: Partial<Student>) {
    try {
      const student = await updateStudent(id, updatedData);
      return { data: student, message: 'Student updated successfully' };
    } catch (error) {
      return { error: 'Failed to update student', message: error.message };
    }
  }

  @Delete(':id')
  async deleteStudent(@Param('id') id: string) {
    try {
      await deleteStudent(id);
      return { message: 'Student deleted successfully' };
    } catch (error) {
      return { error: 'Failed to delete student', message: error.message };
    }
  }
}
