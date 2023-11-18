import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { AuthService } from '../auth/auth.service';
import { Role } from '@prisma/client';
import Protected from '../auth/guards/protected.decorator';


@Controller('communication')
export class CommunicationController {

  constructor() {
  }

  @Protected(Role.PRINCIPAL, Role.HEAD_TEACHER, Role.ADMIN)
  @Patch("events/:id")
  async updateEvent(@Param('id') id: string) {
    //service impl here
    return "event updated";
  }

  @Protected(Role.PRINCIPAL, Role.HEAD_TEACHER, Role.ADMIN)
  @Post("events")
  async createEvent() {
    //service impl here
    return "event created";
  }

  @Protected(Role.PRINCIPAL, Role.HEAD_TEACHER, Role.ADMIN)
  @Delete("events/:id")
  //service impl here
  deleteEvent(@Param('id') id: string): string {
    return "event deleted";
  }

  @Protected()
  @Get("events/:id")
  //service impl here
  getEvent(): string {
    return "event";
  }

  @Protected()
  @Get("events")
  //service impl here
  getEvents(): string {
    return "events";
  }

  @Protected()
  @Delete("announcements/:id/comments/:commentId")
  //service impl here
  deleteComment(@Param('id') id: string, @Param('commentId') commentId: string): string {
    return "comment deleted";
  }

  @Protected()
  @Post("announcements/:id/comments")
  //service impl here
  createComment(@Param('id') id: string): string {
    return "comment created";
  }

  @Protected(Role.HEAD_TEACHER, Role.TEACHER, Role.PRINCIPAL, Role.ADMIN)
  @Delete("announcements/:id")
  //service impl here
  deleteAnnouncement(@Param('id') id: string): string {
    return "announcement deleted";
  }

  @Protected(Role.PRINCIPAL, Role.HEAD_TEACHER, Role.TEACHER, Role.ADMIN)
  @Patch("announcements/:id")
  //service impl here
  updateAnnouncement(@Param('id') id: string): string {
    return "announcement updated";
  }

  @Protected(Role.PRINCIPAL, Role.HEAD_TEACHER, Role.TEACHER, Role.ADMIN)
  @Post("announcements")
  //service impl here
  createAnnouncement(): string {
    return "announcement created";
  }

  @Protected()
  @Get("announcements/:id")
  //service impl here
  getAnnouncement(@Param('id') id: string): string {
    return "announcement";
  }

  @Protected()
  @Get("announcements")
  //service impl here
  getAnnouncements(): string {
    return "announcements";
  }
}