import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { Role } from "@prisma/client";
import { PASSWORD_REGEX } from "../../utils/constants";

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() password: string;
}

export class CreateRootUserDto {
  @Matches(PASSWORD_REGEX) password: string;
}

export type JwtPayload = {
  username: string,
  sub: {
    id: string,
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