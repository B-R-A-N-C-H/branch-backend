import { Module } from '@nestjs/common';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';

@Module({
  controllers: [CommunicationController],
  providers: [CommunicationService]
})
export class CommunicationModule {}
