import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../utils/database/prisma.service';
import { createEventDto, updateEventDto } from './dto/communication.dto';

@Injectable()
export class CommunicationService {
  constructor(private prisma: PrismaService) {}

  async updateEvent(eventId: string, dto: updateEventDto)  {
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

  async createEvent(dto: createEventDto) {
    try {
      return await this.prisma.event.create({
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create the event. Details: ' + error.message);
    }
  }

}
