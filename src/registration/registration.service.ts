import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { JwtPayload } from "src/auth/dto/auth.dto";
import { PrismaService } from "src/utils/database/prisma.service";
import {
  CreateRegistrationDto,
  CreateRegistrationPeriodDto,
  UpdateRegistrationPeriodDto
} from "./dto/registration.dto";


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
          lte: currentDate
        },
        ends: {
          gte: currentDate
        }
      }
    });
    if (!regPeriod)
      throw new BadRequestException("Registration is not open!");
    return this.prisma.registrationEntry.create({
      data: {
        ...dto,
        secondaryEmergencyConctactNumber: dto.secondaryEmergencyConctactNumber ?? null,
        memberId: authUser.sub.id,
        registrationPeriodId: regPeriod.id
      }
    });
  }

  async createRegistrationPeriod(authUser: JwtPayload, dto: CreateRegistrationPeriodDto) {
    //Need to fix range detection
    try {
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
                lte: startDay
              }
            },
            {
              ends: {
                gte: startDay,
                lte: endDay
              }
            }
          ]
        }
      });
      if (existingPeriod)
        throw new ConflictException("A registration period in that range already exists!");

      return this.prisma.registrationPeriod.create({
        data: dto
      });
    } catch (error) {
      throw new BadRequestException("Failed to create period. Details: ", error.message);
    }
  }

  async getAllRegistrationPeriods(authUser: JwtPayload) {
    const periods = await this.prisma.registrationPeriod.findMany();
    if (!periods.length)
      throw new BadRequestException("There are no registration periods");
    return periods;
  }

  async getRegistrationPeriod(/*authUser: JwtPayload,*/ regId: string) {
    const period = await this.prisma.registrationPeriod.findUnique({
      where: {
        id: regId
      }
    });
    if (!period)
      throw new BadRequestException(`There is no registration period with ID ${regId}`);
    return period;
  }

  async deleteRegistrationPeriod(/*authUser: JwtPayload,*/ regId: string) {
    const period = await this.getRegistrationPeriod(/*authUser,*/ regId);
    return this.prisma.registrationPeriod.delete({
      where: {
        id: regId
      }
    });
  }

  async updateRegistrationPeriod(/*authUser: JwtPayload, */regId: string, dto: UpdateRegistrationPeriodDto) {
    return this.getRegistrationPeriod(regId).then(async (period) => {
      return await this.prisma.registrationPeriod.update({
        where: {
          id: regId
        },
        data: dto
      });
    });
  }
}