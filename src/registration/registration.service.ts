import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/utils/database/prisma.service';
import {
    CreateRegistrationDto,
    CreateRegistrationPeriodDto,
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