import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResponseModule } from 'src/response/response.module';

@Module({
  imports:[PrismaModule, ResponseModule],
  providers: [ActivitiesService],
  controllers: [ActivitiesController]
})
export class ActivitiesModule {}
