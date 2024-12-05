import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { GetUser } from '../common/decorators/get-user.decorator';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }
