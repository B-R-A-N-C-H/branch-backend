import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { RolesGuard } from "./roles.guard";
import { JwtGuard } from "./jwt.guard";

/**
 * This decorator only specified roles to access an endpoint.
 * This **MUST** be used with the RolesGuard
 *
 * Example:
 * ```
 * @UseGuard(JwtGuard, RolesGuard)
 * @Roles([Role.ADMIN])
 * async deleteUser() {...}
 * ```
 */
export const Roles = Reflector.createDecorator<Role[]>();

/**
 * This decorator combines the JwtGuard, RolesGuard and Roles decorator all into
 * one convenient decorator.
 *
 * Example:
 * ```
 * @Protected(Role.Admin)
 * async deleteUser() {...}
 * ```
 *
 * @param roles The specific roles that should have access to the decorated endpoint.
 * If no roles are passed every authenticated user will be able to access the endpoint.
 * @constructor
 */
export default function Protected(...roles: Role[]) {
  return applyDecorators(
    UseGuards(JwtGuard, RolesGuard),
    Roles(roles)
  )
}