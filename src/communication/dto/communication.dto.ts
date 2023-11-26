import { Role } from "@prisma/client";
import {
   IsDateString,
   IsNotEmpty,
   IsOptional,
   IsString,
} from 'class-validator';

export class UpdateEventDto{
   @IsString() @IsNotEmpty()
   name: string;

   @IsOptional()
   @IsDateString()
   readonly starts?: Date;

   @IsOptional()
   @IsDateString()
   readonly ends?: Date;
}

export class CreateEventDto{
    @IsString() @IsNotEmpty()
    name: string;

    @IsDateString()
    starts: Date;

    @IsDateString()
    ends: Date;
}

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  announcerId: string;
}

export class CreateAnnouncementCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  announcementId: string;

  @IsString()
  @IsNotEmpty()
  commenterId: string;

  @IsString()
  @IsOptional()
  parentCommentId?: string;
}

export class UpdateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  announcerId: string;
}