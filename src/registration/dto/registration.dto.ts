import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsString } from "class-validator"



export class CreateRegistrationDto {
    gradeLevel: number
    childFirstName: string
    childLastName: string
    childDateofBirth: Date
    streetName: string
    city: string
    parish: string
    emergencyContactNumber: string
    secondaryEmergencyContactNumber?: string
}

export class CreateRegistrationPeriodDto {
    @IsString() @IsNotEmpty() name: string;
    @IsDate() @Type(() => Date) starts: Date
    @IsDate() @Type(() => Date) ends: Date
}