import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}

