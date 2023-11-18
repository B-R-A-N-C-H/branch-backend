import { Injectable, NotFoundException } from '@nestjs/common';
import {PrismaService} from '../utils/database/prisma.service';
import {updateEventDto} from './dto/communication.dto';

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
}
