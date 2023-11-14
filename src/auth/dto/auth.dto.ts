import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Role } from "@prisma/client";

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() password: string;
}

export type JwtPayload = {
  username: string,
  sub: {
    name: string,
    lastName: string,
    role?: Role | null
  }
}

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}