import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { IsFacultyExistsConstraint } from './decorator/isFacultyExist.decorator';
import { IsAchievementExistConstraint } from './decorator';

@Module({
  providers: [
    AchievementService,
    IsFacultyExistsConstraint,
    IsAchievementExistConstraint,
  ],
  controllers: [AchievementController],
})
export class AchievementModule {}
