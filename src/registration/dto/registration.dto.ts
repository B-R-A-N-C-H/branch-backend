import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, IsPhoneNumber, isPhoneNumber, IsString } from "class-validator"



export class CreateRegistrationDto {
    @IsNumber() gradeLevel: number
    @IsString() childFirstName: string
    @IsString() childLastName: string
    @IsString() childDateOfBirth: Date
    @IsString() streetName: string
    @IsString() city: string
    @IsString() parish: string
    @IsString() @IsPhoneNumber("JM") emergencyContactNumber: string
    @IsString() @IsPhoneNumber("JM") secondaryEmergencyConctactNumber?: string
}

export class CreateRegistrationPeriodDto {
    @IsString() @IsNotEmpty() name: string;
    @IsDate() @Type(() => Date) starts: Date
    @IsDate() @Type(() => Date) ends: Date
}