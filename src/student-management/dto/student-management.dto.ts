import {
    IsDate,
    IsDateString,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { Member } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateStudentDto {
    @IsString() @IsOptional() firstName: string;
    @IsString() @IsOptional() lastName: string;

    @IsNumber()
    @Min(1) @Max(3)
    @IsNotEmpty()
    gradeLevel: number;

    @IsOptional()
    @IsDate()
    @Type(()=>Date)
    childDateOfBirth?: Date

    @IsString() @IsOptional() streetName: string;
    @IsString() @IsOptional() city: string;
    @IsString() @IsOptional() parish: string;
    @IsString() @IsOptional() emergencyContactNumber: string;
    @IsString() @IsOptional() secondaryEmergencyContactNumber: string;
}
