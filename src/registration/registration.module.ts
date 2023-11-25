import { Module } from '@nestjs/common';
import { PrismaService } from 'src/utils/database/prisma.service';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

@Module({
    providers: [RegistrationService, PrismaService],
    controllers: [RegistrationController]
})
export class RegistrationModule {


}
