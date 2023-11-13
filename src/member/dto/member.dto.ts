import { IsDefined, IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { PASSWORD_REGEX } from "../../utils/constants";

export class CreateMemberDto {
  @IsEmail() @IsNotEmpty() email: string;

  @IsDefined()
  @Matches(PASSWORD_REGEX, {
    message: "Password doesn't pass the requirements!"
  })
  password: string;

  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
}

export class FindMemberByEmailDto {
  @IsEmail() @IsNotEmpty() email: string;
}