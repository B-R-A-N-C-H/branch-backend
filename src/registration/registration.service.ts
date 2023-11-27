import { BadRequestException, ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { JwtPayload } from "src/auth/dto/auth.dto";
import { Roles } from "src/auth/guards/protected.decorator";
import { PrismaService } from "src/utils/database/prisma.service";
import {
  ApproveRegistrationDto,
  CreateRegistrationDto,
  CreateRegistrationPeriodDto,
  UpdateRegistrationDto,
  UpdateRegistrationPeriodDto
} from "./dto/registration.dto";


@Injectable()
export class RegistrationService {

  constructor(private prisma: PrismaService) {
  }

  async createRegistration(authUser: JwtPayload, dto: CreateRegistrationDto) {
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
        secondaryEmergencyContactNumber: dto.secondaryEmergencyContactNumber ?? null,
        memberId: authUser.sub.id,
        registrationPeriodId: regPeriod.id
      }
    });
  }
  
  async getAllRegistrationEntries(){
    const registrationEntries = await this.prisma.registrationEntry.findMany();
    if (!registrationEntries.length)
      throw new BadRequestException("There are no registration entries")
    return registrationEntries
  }

  async getRegistrationEntry(regEntryId: string){
    const registrationEntry = await this.prisma.registrationEntry.findUnique({
      where:{
        id: regEntryId
      }
    })
    if (!registrationEntry)
      throw new BadRequestException(`There is no registration entry with ID ${regEntryId}`);
    return registrationEntry
  }

  async updateRegistrationEntry(regEntryId: string, dto: UpdateRegistrationDto) {
    return this.getRegistrationEntry(regEntryId).then((regEntry)=>{
      return this.prisma.registrationEntry.update({
        where:{
          id: regEntry.id
        },
        data: dto
      })
    })
}

  async deleteRegistrationEntry(authUser: JwtPayload, regEntryId: string) {
    if(authUser.sub.role === Role.ADMIN || authUser.sub.role === Role.PRINCIPAL){
      const regEntry = await this.getRegistrationEntry(regEntryId)
      return this.prisma.registrationEntry.delete({
        where:{
          id: regEntryId
        }
      })
    }
    else if(authUser.sub.role === undefined){
      const regEntry = await this.getRegistrationEntry(regEntryId)
      return this.prisma.registrationEntry.delete({
        where:{
          id: regEntryId,
          memberId: authUser.sub.id
        }
      })
    }
    throw new ForbiddenException("You can't delete this entry")
  }

  async approveRegistrationEntry(regEntryId: string, dto: ApproveRegistrationDto){
    //Need to fix
    console.log(dto, regEntryId)
    return this.prisma.registrationEntry.update({
      where:{
        id: regEntryId
      },
      data: dto
    })
  }

  async createRegistrationPeriod(/*authUser: JwtPayload,*/ dto: CreateRegistrationPeriodDto) {
    return this.prisma.registrationPeriod.create({
      data: dto
    });
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