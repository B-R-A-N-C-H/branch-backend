import { Role } from "@prisma/client";
import {
   IsDateString,
   IsNotEmpty,
   IsOptional,
   IsString,
} from 'class-validator';

export class updateEventDto{
   @IsString() @IsNotEmpty()
   name: string;

   @IsOptional()
   @IsDateString()
   readonly starts?: Date;

   @IsOptional()
   @IsDateString()
   readonly ends?: Date;
}

export class createEventDto{
    @IsString() @IsNotEmpty()
    name: string;

    @IsDateString()
    starts: Date;

    @IsDateString()
    ends: Date;
}