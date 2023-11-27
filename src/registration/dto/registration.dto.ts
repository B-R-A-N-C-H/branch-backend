import { Type } from "class-transformer"
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    isPhoneNumber,
    IsString,
} from 'class-validator';


enum GradeLevel{
    ONE = 1,
    TWO = 2,
    THREE = 3
}

export class CreateRegistrationDto {
    @IsNumber() @IsEnum(GradeLevel) gradeLevel: number
    @IsString() childFirstName: string
    @IsString() childLastName: string
    @IsDate() @Type(()=>Date) childDateOfBirth: Date
    @IsString() streetName: string
    @IsString() city: string
    @IsString() parish: string
    @IsString() @IsPhoneNumber("JM") emergencyContactNumber: string
    @IsString() @IsPhoneNumber("JM") secondaryEmergencyContactNumber: string
}

export class CreateRegistrationPeriodDto {
    @IsString() @IsNotEmpty() name: string;
    @IsDate() @Type(() => Date) starts: Date
    @IsDate() @Type(() => Date) ends: Date
}

export class UpdateRegistrationPeriodDto {
    @IsOptional() @IsString() @IsNotEmpty() name?: string;
    @IsOptional() @IsDate() @Type(() => Date) starts?: Date
    @IsOptional() @IsDate() @Type(() => Date) ends?: Date
}

export class UpdateRegistrationDto {
    @IsOptional() @IsNumber() @IsEnum(GradeLevel) gradeLevel?: number
    @IsOptional() @IsString() childFirstName?: string
    @IsOptional() @IsString() childLastName?: string
    @IsOptional() @IsDate() @Type(()=>Date) childDateOfBirth?: Date
    @IsOptional() @IsString() streetName?: string
    @IsOptional() @IsString() city?: string
    @IsOptional() @IsString() parish?: string
    @IsOptional() @IsString() @IsPhoneNumber("JM") emergencyContactNumber?: string
    @IsOptional() @IsString() @IsPhoneNumber("JM") secondaryEmergencyContactNumber?: string
}

export class ApproveRegistrationDto {
    @IsBoolean() @IsNotEmpty() approved: boolean
}

export enum RegistrationPeriodStatus {
    OPEN,
    ALL,
    CLOSED,
}

export class FetchRegistrationPeriodsQueryDto {
    @IsOptional() @IsEnum(RegistrationPeriodStatus) status?: RegistrationPeriodStatus
}