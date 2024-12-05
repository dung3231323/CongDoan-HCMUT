import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { PrismaService } from '../prisma/prisma.service'; // Assuming you have a PrismaService to handle Prisma Client
import { APP_FILTER } from '@nestjs/core';
import { CustomBadRequestFilter } from './dto/dto.validation';


@Module({
  controllers: [ParticipantsController],
  providers: [ParticipantsService, PrismaService
  ],
 
})
export class ParticipantsModule {}

