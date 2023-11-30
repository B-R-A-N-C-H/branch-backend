import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Member } from '@prisma/client';

export class UpdateStudentDto {
    @IsString() @IsOptional() firstName: string;
    @IsString() @IsOptional() lastName: string;

    @IsNumber()
    @Min(1) @Max(3)
    @IsNotEmpty()
    gradeLevel: number;

    @IsString() @IsOptional() streetName: string;
    @IsString() @IsOptional() city: string;
    @IsString() @IsOptional() parish: string;
    @IsString() @IsOptional() emergencyContactNumber: string;
    @IsString() @IsOptional() secondaryEmergencyContactNumber: string;
}
