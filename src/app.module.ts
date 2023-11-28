import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MemberModule } from "./member/member.module";
import {CommunicationModule} from './communication/communication.module';
import { AuthModule } from "./auth/auth.module";
import configuration from "./utils/config/configuration";
import { PrismaService } from "./utils/database/prisma.service";
import { RegistrationModule } from './registration/registration.module';
import { FileSystemService } from './file-system/file-system.service';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true
  }),
    MemberModule,
    AuthModule,
    CommunicationModule
    RegistrationModule,
  ],
  providers: [PrismaService, FileSystemService]
})

export class AppModule {
}
