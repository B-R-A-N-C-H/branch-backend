import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { JwtPayload } from "src/auth/dto/auth.dto";
import { PrismaService } from "src/utils/database/prisma.service";
import { CreateRegistrationDto, CreateRegistrationPeriodDto } from "./dto/registration.dto";


@Injectable()
export class RegistrationService {

    constructor(private prisma: PrismaService) { }

    async createRegistration(authUser: JwtPayload, dto: CreateRegistrationDto) {
        //Implement Code
    }

    async createRegistrationPeriod(authUser: JwtPayload, dto: CreateRegistrationPeriodDto) {
        try {
            const startDay = dto.starts
            startDay.setHours(0, 0, 0, 0)
            const endDay = dto.starts
            endDay.setHours(0, 0, 0, 0)
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
            })
            console.log(existingPeriod)
            if (existingPeriod)
                throw new ConflictException("A registration period in that range already exists!");

            return this.prisma.registrationPeriod.create({
                data: dto
            })
        } catch (error) {
            throw new BadRequestException("Failed to create period. Details: ", error.message);
        }
    }

}