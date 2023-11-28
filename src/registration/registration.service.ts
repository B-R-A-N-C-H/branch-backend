import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtPayload } from 'src/auth/dto/auth.dto';
import { FileSystemService } from 'src/file-system/file-system.service';
import { PrismaService } from 'src/utils/database/prisma.service';
import {
    ApproveRegistrationDto,
    CreateRegistrationDto,
    CreateRegistrationPeriodDto,
    RegistrationPeriodStatus,
    UpdateRegistrationDto,
    UpdateRegistrationPeriodDto,
} from './dto/registration.dto';


@Injectable()
export class RegistrationService {

    constructor(private prisma: PrismaService, private fileSystem: FileSystemService) {
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
        const entry = await this.getRegistrationEntry(regEntryId);

        if (entry.memberId !== authUser.sub.id
            && authUser.sub.role !== Role.ADMIN
            && authUser.sub.role !== Role.PRINCIPAL
        )
            throw new ForbiddenException('You can\'t delete this entry');

        return this.prisma.registrationEntry.delete({
            where: {
                id: regEntryId,
                memberId: authUser.sub.id,
            },
        });
    }

    async getRegistrationEntry(regEntryId: string) {
        const registrationEntry = await this.prisma.registrationEntry.findUnique({
            where: {
                id: regEntryId,
            },
        });
        if (!registrationEntry)
            throw new BadRequestException(`There is no registration entry with ID ${regEntryId}`);
        return registrationEntry;
    }

    async getAllRegistrationEntries(user: JwtPayload) {
        return this.prisma.registrationEntry.findMany({
            where: !([Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER] as Role[]).includes(user.sub.role) ? {
                memberId: user.sub.id,
            } : undefined,
        });
    }

    async updateRegistrationEntry(regEntryId: string, dto: UpdateRegistrationDto) {
        return this.getRegistrationEntry(regEntryId).then((regEntry) => {
            return this.prisma.registrationEntry.update({
                where: {
                    id: regEntry.id,
                },
                data: dto,
            });
        });
    }

    async approveRegistrationEntry(regEntryId: string, dto: ApproveRegistrationDto) {
        return this.prisma.registrationEntry.update({
            where: {
                id: regEntryId,
            },
            data: dto,
        });
    }

    async createRegistrationPeriod(dto: CreateRegistrationPeriodDto) {
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
        return this.prisma.registrationPeriod.findMany({
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

    async uploadDocument(file: Express.Multer.File) {
        const filePrefix = process.env.FILE_PREFIX;
        const regDocument = await this.prisma.registrationDocument.upsert({
            where: {
                name: file.originalname,
            },
            create: {
                name: file.originalname,
                mimeType: file.mimetype,
            },
            update: {
                name: file.originalname,
                mimeType: file.mimetype,
            },
        });
        this.fileSystem.createFile(file, filePrefix);

        return regDocument;
    }

    async getDocument(fileId: string) {
        const filePrefix = process.env.FILE_PREFIX;
        const regDocument = await this.getDocumentQuery(fileId);
        if (!regDocument)
            throw new BadRequestException(`There is no registration period with ID ${fileId}`);
        return this.fileSystem.fetchFile(filePrefix, regDocument.name);
    }

    async getDocumentQuery(fileId: string) {
        return this.prisma.registrationDocument.findUnique({
            where: {
                id: fileId,
            },
        });
    }

    async getAllDocuments() {
        return this.prisma.registrationDocument.findMany();
    }

    async deleteDocument(fileId: string) {
        const filePrefix = process.env.FILE_PREFIX;
        const regDocument = await this.getDocumentQuery(fileId);
        if (!regDocument)
            throw new BadRequestException(`There is no registration period with ID ${fileId}`);
        this.fileSystem.deleteFile(`${filePrefix}/${regDocument.name}`);
        return this.prisma.registrationDocument.delete({
            where: {
                id: fileId,
            },
        });
    }
}