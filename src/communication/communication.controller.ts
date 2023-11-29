import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { Role } from '@prisma/client';
import Protected from '../auth/guards/protected.decorator';
import {
    CreateEventDto,
    UpdateEventDto,
    CreateAnnouncementCommentDto,
    CreateAnnouncementDto,
    UpdateAnnouncementDto,
} from './dto/communication.dto';
import { AuthenticatedUser } from '../auth/guards/auth-user.decorator';
import { JwtPayload } from '../auth/dto/auth.dto';


@Controller('communication')
export class CommunicationController {

    constructor(private communicationService: CommunicationService) {
    }

    @Protected(Role.PRINCIPAL, Role.HEAD_TEACHER, Role.ADMIN)
    @Patch('events/:id')
    async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
        return this.communicationService.updateEvent(id, dto);
    }

    @Protected(Role.PRINCIPAL, Role.HEAD_TEACHER, Role.ADMIN)
    @Post('events')
    async createEvent(@Body() dto: CreateEventDto) {
        return this.communicationService.createEvent(dto);
    }

    @Protected(Role.PRINCIPAL, Role.HEAD_TEACHER, Role.ADMIN)
    @Delete('events/:id')
    async deleteEvent(@Param('id') id: string) {
        return this.communicationService.deleteEvent(id);
    }

    @Protected()
    @Get('events/:id')
    async getEvent(@Param('id') id: string) {
        return this.communicationService.getEvent(id);
    }

    @Protected()
    @Get('events')
    async getAllEvents() {
        return this.communicationService.getAllEvents();
    }

    @Protected()
    @Delete('announcements/:id/comments/:commentId')
    async deleteAnnouncementComment(@AuthenticatedUser() authUser: JwtPayload, @Param('commentId') commentId: string) {
        return this.communicationService.deleteAnnouncementComment(authUser, commentId);
    }

    @Protected()
    @Post('announcements/:id/comments')
    async createAnnouncementComment(@AuthenticatedUser() authUser: JwtPayload, @Param('id') id: string, @Body() dto: CreateAnnouncementCommentDto) {
        return this.communicationService.createAnnouncementComment(authUser, id, dto);
    }

    @Protected(Role.HEAD_TEACHER, Role.TEACHER, Role.PRINCIPAL, Role.ADMIN)
    @Delete('announcements/:id')
    async deleteAnnouncement(@Param('id') id: string) {
        return this.communicationService.deleteAnnouncement(id);
    }

    @Protected(Role.PRINCIPAL, Role.HEAD_TEACHER, Role.TEACHER, Role.ADMIN)
    @Patch('announcements/:id')
    async updateAnnouncement(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) {
        return this.communicationService.updateAnnouncement(id, dto);
    }

    @Protected(Role.PRINCIPAL, Role.HEAD_TEACHER, Role.TEACHER, Role.ADMIN)
    @Post('announcements')
    async createAnnouncement(@Body() dto: CreateAnnouncementDto) {
        return this.communicationService.createAnnouncement(dto);
    }

    @Protected()
    @Get('announcements/:id')
    async getAnnouncement(@AuthenticatedUser() authenticatedUser: JwtPayload, @Param('id') id: string) {
        return this.communicationService.getAnnouncement(authenticatedUser, id);
    }

    @Protected()
    @Get('announcements')
    async getAllAnnouncements(@AuthenticatedUser() authenticatedUser: JwtPayload) {
        return this.communicationService.getAllAnnouncements(authenticatedUser);
    }

}
