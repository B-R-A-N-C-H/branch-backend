import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../utils/database/prisma.service';
import {
    CreateEventDto,
    UpdateEventDto,
    CreateAnnouncementCommentDto,
    CreateAnnouncementDto,
} from './dto/communication.dto';
import { JwtPayload } from '../auth/dto/auth.dto';
import { Member, Role, Student } from '@prisma/client';
import { MemberService } from '../member/member.service';

@Injectable()
export class CommunicationService {
    constructor(private prisma: PrismaService, private memberService: MemberService) {
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

    async deleteAnnouncementComment(user: JwtPayload, commentId: string) {
        const comment = await this.prisma.announcementComment.findUnique({
            where: { id: commentId },
            include: { announcement: true },
        });

        if (!comment)
            throw new NotFoundException(`There is no such comment with the ID: ${commentId}`);

        if (!this.memberService.memberHasRole(user) && comment.commenterId !== user.sub.id)
            throw new ForbiddenException('You cannot delete this comment!');

        return this.prisma.announcementComment.delete({
            where: { id: commentId },
        });
    }

    async createAnnouncementComment(user: JwtPayload, announcementId: string, dto: CreateAnnouncementCommentDto) {
        const memberAnnouncementLevels = await this.fetchMemberAnnouncementLevels(user.sub.id);
        const announcement = await this.prisma.announcement.findUnique({
            where: {
                id: announcementId,
                level: {
                    in: memberAnnouncementLevels,
                },
            },
        });

        if (!announcement)
            throw new ForbiddenException(`You can't create a comment for such an announcement!`);

        if (!announcement.commentsEnabled)
            throw new ForbiddenException('Comments are disabled for this announcement!');

        try {
            return await this.prisma.announcementComment.create({
                data: {
                    content: dto.content,
                    announcementId: announcementId,
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
            const announcementLevels = this.generateMemberAnnouncementLevels(member);

            if (announcementLevels.length === 0) {
                // Users with no registered students see only global announcements
                whereQuery = { level: 'GLOBAL' };
            } else {
                whereQuery = {
                    level: {
                        in: announcementLevels,
                    },
                };
            }
        }

        return whereQuery;
    }

    private async fetchMemberAnnouncementLevels(memberId: string) {
        const member = await this.prisma.member.findUnique({
            where: {
                id: memberId,
            },
            include: { children: true },
        });

        if (!member)
            throw new UnauthorizedException('You don\'t have a valid account!');
        return this.generateMemberAnnouncementLevels(member);
    }

    private generateMemberAnnouncementLevels(member: Member & { children: Student[] }) {
        const childGradeLevels = member.children.map(child => parseInt(child.gradeLevel));
        return [...new Set(
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
    }

}
