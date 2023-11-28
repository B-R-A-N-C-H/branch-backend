import { Module } from '@nestjs/common';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { PrismaService } from '../utils/database/prisma.service';
import { MemberService } from '../member/member.service';

@Module({
  controllers: [CommunicationController],
  providers: [CommunicationService, PrismaService, MemberService]
})
export class CommunicationModule {}
