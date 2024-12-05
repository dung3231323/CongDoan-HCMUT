import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { ParticipantsModule } from "./participants/participants.module";
import { FacultyModule } from "./faculty/faculty.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UnionDepartmentModule } from "./union-department/union-department.module";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";
import { AchievementModule } from "./achievement/achievement.module";
import { JwtGuard } from "./common/guards";
import { ActivitiesModule } from "./activities/Activity/activities.module";
import { CategoryModule } from "./activities/Category/category.module";
import { AuthModule } from "./auth/auth.module";
import { ResponseModule } from "./response/response.module";
import { RoleGuard } from "./common/guards/role.guard";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    ParticipantsModule,
    ActivitiesModule,
    FacultyModule,

    UnionDepartmentModule,
    PassportModule.register({ session: true }),
    AchievementModule,
    PrismaModule,
    CategoryModule,
    ResponseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
