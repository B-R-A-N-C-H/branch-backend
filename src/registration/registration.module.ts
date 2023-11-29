import { Module } from '@nestjs/common';
import { FileSystemService } from 'src/file-system/file-system.service';
import { PrismaService } from 'src/utils/database/prisma.service';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

@Module({
    providers: [RegistrationService, PrismaService, FileSystemService],
    controllers: [RegistrationController]
})
export class RegistrationModule {


}
