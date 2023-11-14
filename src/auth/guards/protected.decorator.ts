import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { RolesGuard } from "./roles.guard";
import { JwtGuard } from "./jwt.guard";

export const Roles = Reflector.createDecorator<Role[]>();
export default function Protected(...roles: Role[]) {
  return applyDecorators(
    UseGuards(JwtGuard, RolesGuard),
    Roles(roles)
  )
}