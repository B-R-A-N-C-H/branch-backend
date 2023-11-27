import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MemberModule } from "./member/member.module";
import { AuthModule } from "./auth/auth.module";
import configuration from "./utils/config/configuration";
import { PrismaService } from "./utils/database/prisma.service";
import { FileSystemService } from './file-system/file-system.service';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true
  }),
    MemberModule,
    AuthModule
  ],
  providers: [PrismaService, FileSystemService]
})

export class AppModule {
}
