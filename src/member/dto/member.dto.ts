import { Allow, IsDefined, IsEmail, IsEnum, IsNotEmpty, IsString, Matches, ValidateIf } from "class-validator";
import { PASSWORD_REGEX } from "../../utils/constants";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Role } from "@prisma/client";

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

export class UpdateMemberDto extends PartialType(OmitType(CreateMemberDto, ["password", "email"] as const)) {
  @IsEnum(Role)
  @ValidateIf((_, val) => val !== null)
  role?: Role | null;
}

export class UpdateSelfMemberDto extends OmitType(UpdateMemberDto, ["role"] as const) {
}

