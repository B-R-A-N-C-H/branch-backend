import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../utils/database/prisma.service';
import { CreateEventDto, UpdateEventDto, CreateAnnouncementCommentDto } from './dto/communication.dto';

@Injectable()
export class CommunicationService {
  constructor(private prisma: PrismaService) {}

  async updateEvent(eventId: string, dto: UpdateEventDto)  {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: dto,
    });
  }

  async createEvent(dto: CreateEventDto) {
    try {
      return await this.prisma.event.create({
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create the event. Details: ' + error.message);
    }
  }

  async deleteEvent(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.delete({
      where: {
        id: eventId,
      },
    });
  }
  async getEvent(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async getAllEvents() {
    return this.prisma.event.findMany();
  }

  async deleteAnnouncementComment(announcementId: string, commentId: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return this.prisma.announcement.delete({
      where: {
        id: commentId,
      },
    });
  }

  async createAnnouncementComment(id: string, dto: CreateAnnouncementCommentDto) {
    try {
      return await this.prisma.announcementComment.create({
        data: {
          content: dto.content,
          announcementId: dto.announcementId,
          commenterId: dto.commenterId,
          //include the parentCommentId if it exists in the DTO
          ...(dto.parentCommentId && { parentCommentId: dto.parentCommentId }),
        }
      });
    } catch (error) {
      throw new BadRequestException('Failed to create the comment. Details: ' + error.message);
    }
  }

  async deleteAnnouncement(announcementId: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return this.prisma.announcement.delete({
      where: {
        id: announcementId,
      },
    });
  }

  async updateAnnouncement(announcementId: string, dto: any) {
    const announcement = await this.prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return this.prisma.announcement.update({
      where: {
        id: announcementId,
      },
      data: dto,
    });
  }

  async createAnnouncement(dto: any) {
    try {
      return await this.prisma.announcement.create({
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create the announcement. Details: ' + error.message);
    }
  }

  async getAnnouncement(announcementId: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return announcement;
  }

  async getAllAnnouncements() {
    return this.prisma.announcement.findMany();
  }
}
