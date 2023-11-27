import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from "@prisma/client";
import { JwtPayload } from 'src/auth/dto/auth.dto';
import { Roles } from "src/auth/guards/protected.decorator";
import { PrismaService } from 'src/utils/database/prisma.service';
import {
  ApproveRegistrationDto,
  CreateRegistrationDto,
  CreateRegistrationPeriodDto,
  UpdateRegistrationDto,
  RegistrationPeriodStatus,
  UpdateRegistrationPeriodDto,
} from './dto/registration.dto';


@Injectable()
export class RegistrationService {

  constructor(private prisma: PrismaService) {
  }

  async createRegistration(authUser: JwtPayload, dto: CreateRegistrationDto) {
    //Needs Fixing
    const currentDate = new Date();
    const regPeriod = await this.prisma.registrationPeriod.findFirst({
      where: {
        starts: {
          lte: currentDate,
        },
        ends: {
          gte: currentDate,
        },
      },
    });
    if (!regPeriod)
      throw new BadRequestException('Registration is not open!');
    return this.prisma.registrationEntry.create({
      data: {
        ...dto,
        secondaryEmergencyContactNumber: dto.secondaryEmergencyContactNumber ?? null,
        memberId: authUser.sub.id,
        registrationPeriodId: regPeriod.id,
      },
    });
  }
  async deleteRegistrationEntry(authUser: JwtPayload, regEntryId: string) {
    if (authUser.sub.role === Role.ADMIN || authUser.sub.role === Role.PRINCIPAL) {
      const regEntry = await this.getRegistrationEntry(regEntryId)
      return this.prisma.registrationEntry.delete({
        where: {
          id: regEntryId
        }
      })
    }
    else if (authUser.sub.role === undefined) {
      const regEntry = await this.getRegistrationEntry(regEntryId)
      return this.prisma.registrationEntry.delete({
        where: {
          id: regEntryId,
          memberId: authUser.sub.id
        }
      })
    }
    throw new ForbiddenException("You can't delete this entry")
  }

  async getRegistrationEntry(regEntryId: string) {
    const registrationEntry = await this.prisma.registrationEntry.findUnique({
      where: {
        id: regEntryId
      }
    })
    if (!registrationEntry)
      throw new BadRequestException(`There is no registration entry with ID ${regEntryId}`);
    return registrationEntry
  }

  async getAllRegistrationEntries() {
    const registrationEntries = await this.prisma.registrationEntry.findMany();
    if (!registrationEntries.length)
      throw new BadRequestException("There are no registration entries")
    return registrationEntries
  }

  async updateRegistrationEntry(regEntryId: string, dto: UpdateRegistrationDto) {
    return this.getRegistrationEntry(regEntryId).then((regEntry) => {
      return this.prisma.registrationEntry.update({
        where: {
          id: regEntry.id
        },
        data: dto
      })
    })
  }

  async approveRegistrationEntry(regEntryId: string, dto: ApproveRegistrationDto){
    return this.prisma.registrationEntry.update({
      where:{
        id: regEntryId
      },
      data: dto
    })
  }

  async createRegistrationPeriod(authUser: JwtPayload, dto: CreateRegistrationPeriodDto) {
    const startDay = dto.starts;
    startDay.setHours(0, 0, 0, 0);
    const endDay = dto.starts;
    endDay.setHours(0, 0, 0, 0);
    const existingPeriod = await this.prisma.registrationPeriod.findFirst({
      where: {
        OR: [
          {
            starts: {
              gte: endDay,
              lte: startDay,
            },
          },
          {
            ends: {
              gte: startDay,
              lte: endDay,
            },
          },
        ],
      },
    });
    if (existingPeriod)
      throw new ConflictException('A registration period in that range already exists!');

    //Need to fix range detection
    try {
      return this.prisma.registrationPeriod.create({
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create period. Details: ', error.message);
    }
  }

  async getAllRegistrationPeriods(status: RegistrationPeriodStatus = RegistrationPeriodStatus.ALL) {
    const today = new Date();

    const periods = await this.prisma.registrationPeriod.findMany({
      where: status === RegistrationPeriodStatus.OPEN ? {
        starts: {
          gte: today,
        },
        ends: {
          lte: today,
        },
      } : (status === RegistrationPeriodStatus.CLOSED ? {
        starts: {
          lt: today,
        },
        ends: {
          lt: today,
        },
      } : undefined),
    });
    return periods;
  }

  async getRegistrationPeriod(regId: string) {
    const period = await this.prisma.registrationPeriod.findUnique({
      where: {
        id: regId,
      },
    });
    if (!period)
      throw new BadRequestException(`There is no registration period with ID ${regId}`);
    return period;
  }

  async deleteRegistrationPeriod(regId: string) {
    await this.getRegistrationPeriod(regId);

    return this.prisma.registrationPeriod.delete({
      where: {
        id: regId,
      },
    });
  }

  async updateRegistrationPeriod(regId: string, dto: UpdateRegistrationPeriodDto) {
    return this.getRegistrationPeriod(regId)
      .then(() => this.prisma.registrationPeriod.update({
        where: {
          id: regId,
        },
        data: dto,
      }),
      );
  }
}