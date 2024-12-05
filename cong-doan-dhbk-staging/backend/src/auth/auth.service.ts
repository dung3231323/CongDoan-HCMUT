import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { AUTH_MESSAGES } from "src/common/constants";
import { JwtPayLoad } from "src/common/model/jwt-payload.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  private oauth2Client: OAuth2Client;
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    console.log(config.get("GOOGLE_CLIENT_ID"), config.get("GOOGLE_CLIENT_SECRET"), config.get("GOOGLE_REDIRECT_URI"));
    this.oauth2Client = new OAuth2Client(
      config.get("GOOGLE_CLIENT_ID"),
      config.get("GOOGLE_CLIENT_SECRET"),
      config.get("GOOGLE_REDIRECT_URI"),
    );
  }

  generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile"],
    });
  }

  async verifyUser(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);

      const options = {
        idToken: tokens.id_token,
        audience: this.config.get("GOOGLE_CLIENT_ID"),
      };

      const ticket = await this.oauth2Client.verifyIdToken(options);

      const { email, family_name, given_name, picture } = ticket.getPayload();
      return { email, family_name, given_name, picture };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(AUTH_MESSAGES.INVALID_CODE);
    }
  }

  async validateUser(email: string, family_name: string, given_name: string, picture: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);

    if (user.familyName === "---" || user.givenName === "---") {
      this.userService.updateNameForNewUser(email, family_name, given_name);
    }

    return user;
  }

  async signToken(user: User) {
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      unionDeptId: user.unionDeptId,
    } as JwtPayLoad;

    if (tokenPayload.role == "MODERATOR" && tokenPayload.unionDeptId == null)
      throw new InternalServerErrorException(AUTH_MESSAGES.INVALID_USER_ATTRIBUTE_SERVER_ERROR);

    return this.jwtService.signAsync(tokenPayload, {
      secret: this.config.get<string>("jwt_secret"),
      expiresIn: "1h",
    });
  }
}
