import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() password: string;
}

export type JwtPayload = {
  username: string,
  sub: {
    name: string,
    lastName: string,
  }
}

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}