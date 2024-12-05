import { Controller, ForbiddenException, Get, Query, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./guard";
import { Response } from "express";
import { Public } from "src/common/decorators";
import { ApiTags } from "@nestjs/swagger";
import { AUTH_MESSAGES } from "src/common/constants";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get("google/login")
  @UseGuards(GoogleAuthGuard) //use this to handle redirection
  login() {
    return { msg: "ok" };
  }

  @Public()
  @Get("google/redirect")
  async redirect(@Query("code") code: string) {
    if (!code) {
      throw new ForbiddenException(AUTH_MESSAGES.AUTHORIZATION_CODE_REQUIRED);
    }
    console.log(code);
    const {
      email,
      family_name,
      given_name,
      picture,
    } = await this.authService.verifyUser(code); //This might be helpful

    const user = await this.authService.validateUser(email, family_name, given_name, picture);

    const token = await this.authService.signToken(user);

    return {
      msg: "Success",
      data: {
        token,
        user,
      },
    };
  }
}
