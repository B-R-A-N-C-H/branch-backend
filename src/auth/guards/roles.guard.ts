import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "./protected.decorator";
import { Request } from "express";
import { JwtPayload } from "../dto/auth.dto";
import { Role } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles || !roles.length)
      return true;

    const req: Request = context.switchToHttp().getRequest();
    return this.matchRoles(req.user, roles);
  }

  private matchRoles(user: JwtPayload, roles: Role[]): boolean {
    return roles.includes(user.sub.role);
  }
}