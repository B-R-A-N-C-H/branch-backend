import {
    IsBoolean, IsDate,
    IsDateString, IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { AnnouncementLevel } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateEventDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsOptional()
    @IsDate() @Type(() => Date)
    readonly starts?: Date;

    @IsOptional()
    @IsDate() @Type(() => Date)
    readonly ends?: Date;
}

export class CreateEventDto {
    @IsString() @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsDate() @Type(() => Date)
    starts: Date;

    @IsNotEmpty()
    @IsDate() @Type(() => Date)
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