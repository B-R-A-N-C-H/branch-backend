import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../utils/database/prisma.service';
import {
    CreateEventDto,
    UpdateEventDto,
    CreateAnnouncementCommentDto,
    CreateAnnouncementDto,
} from './dto/communication.dto';
import { JwtPayload } from '../auth/dto/auth.dto';

@Injectable()
export class CommunicationService {
    constructor(private prisma: PrismaService) {
    }

    async updateEvent(eventId: string, dto: UpdateEventDto) {
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
                comments: {
                    some: {
                        id: commentId,
                    },
                },
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
                    parentCommentId: dto.parentCommentId ?? null,
                },
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

    async createAnnouncement(dto: CreateAnnouncementDto) {
        try {
            return await this.prisma.announcement.create({
                data: dto,
            });
        } catch (error) {
            throw new BadRequestException('Failed to create the announcement. Details: ' + error.message);
        }
    }

    async getAnnouncement(user: JwtPayload, announcementId: string) {
        const announcement = await this.prisma.announcement.findUnique({
            where: {
                id: announcementId,
                ...await this.getAnnouncementFilter(user),
            },
        });

        if (!announcement)
            throw new NotFoundException('Announcement not found');
        return announcement;
    }

    async getAllAnnouncements(user: JwtPayload) {
        return this.prisma.announcement.findMany({
            where: await this.getAnnouncementFilter(user),
        });
    }

    private async getAnnouncementFilter(user: JwtPayload) {
        const member = await this.prisma.member.findUnique({
            where: { id: user.sub.id },
            include: { children: true },
        });

        if (!member)
            throw new NotFoundException('Member not found');

        let whereQuery = {};

        // Apply filtering only for regular users (non-admins)
        if (member.role === null) {
            const childGradeLevels = member.children.map(child => parseInt(child.gradeLevel));

            if (childGradeLevels.length === 0) {
                // Users with no registered students see only global announcements
                whereQuery = { level: 'GLOBAL' };
            } else {
                const childAnnouncementLevels = [...new Set(
                    childGradeLevels
                        .filter(level => [1, 2, 3].includes(level))
                        .map(level => {
                            switch (level) {
                                case 1:
                                    return 'ONE';
                                case 2:
                                    return 'TWO';
                                case 3:
                                    return 'THREE';
                                default:
                                    return 'GLOBAL';
                            }
                        }),
                )];

                whereQuery = {
                    level: {
                        in: childAnnouncementLevels,
                    },
                };
            }
        }

        return whereQuery;
    }

}
