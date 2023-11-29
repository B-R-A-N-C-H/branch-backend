import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { Member } from '@prisma/client';

export class UpdateStudentDto {
    @IsString() @IsNotEmpty() firstName: string;
    @IsString() @IsNotEmpty() lastName: string;

    @IsNumber()
    @Min(1) @Max(3)
    @IsNotEmpty()
    gradeLevel: number;

    @IsString() @IsNotEmpty() streetName: string;
    @IsString() @IsNotEmpty() city: string;
    @IsString() @IsNotEmpty() parish: string;
    @IsString() @IsNotEmpty() emergencyContactNumber: string;
    @IsString() @IsNotEmpty() secondaryEmergencyContactNumber: string;
}
