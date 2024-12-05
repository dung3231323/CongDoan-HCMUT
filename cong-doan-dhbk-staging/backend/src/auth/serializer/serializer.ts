/* eslint-disable @typescript-eslint/ban-types */
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: Function) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {}
  //   const user = await this.authService.findUser(payload.id);
  //   return user ? done(null, user) : done(null, null);
  // }
}
