import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtPayLoad } from "../model/jwt-payload.interface";
import { ACHIEVE_MESSAGES } from "../constants";
import { MODERATOR_KEY } from "../decorators/moderator.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isModeratorRoute = this.reflector.getAllAndOverride<boolean>(MODERATOR_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [context.getHandler(), context.getClass()]);
    if (isPublic || isModeratorRoute) return true;

    const request = context.switchToHttp().getRequest();
    const user: JwtPayLoad = request.user;
    if (user.role == "MODERATOR") {
      throw new ForbiddenException(ACHIEVE_MESSAGES.MODERATOR_NOT_ALLOWED);
    }

    return true;
  }
}
