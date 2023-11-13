import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const AuthenticatedUser = createParamDecorator<unknown, ExecutionContext>((_, context) => {
  const req = context.switchToHttp().getRequest() as Request;
  return req.user;
});