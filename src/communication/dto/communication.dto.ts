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