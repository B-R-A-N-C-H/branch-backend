import {
    IsBoolean,
    IsDateString, IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { AnnouncementLevel } from '@prisma/client';

export class UpdateEventDto {
    @IsString() @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsDateString()
    readonly starts?: Date;

    @IsOptional()
    @IsDateString()
    readonly ends?: Date;
}

export class CreateEventDto {
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
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    announcerId: string;

    @IsEnum(AnnouncementLevel)
    @IsOptional()
    level?: AnnouncementLevel;

    @IsBoolean()
    @IsOptional()
    commentsEnabled?: boolean
}

export class CreateAnnouncementCommentDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    commenterId: string;

    @IsString()
    @IsOptional()
    parentCommentId?: string;
}

export class UpdateAnnouncementDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsEnum(AnnouncementLevel)
    @IsOptional()
    level?: AnnouncementLevel;

    @IsBoolean()
    @IsOptional()
    commentsEnabled?: boolean
}