import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Member } from '@prisma/client';

export class UpdateStudentDto {
  @IsString() @IsNotEmpty() firstName: string
  @IsString() @IsNotEmpty() lastName: string
  @IsString() @IsNotEmpty() gradeLevel: string

  @IsString() @IsNotEmpty() streetName: string
  @IsString() @IsNotEmpty() city: string
  @IsString() @IsNotEmpty() parish: string
  @IsString() @IsNotEmpty() emergencyContactNumber: string
  @IsString() @IsNotEmpty() secondaryEmergencyContactNumber: string

  // @IsString() @IsNotEmpty() parentId: string
  // @IsNotEmpty()parent: Member

  @IsDateString() updatedAt:  Date
}
