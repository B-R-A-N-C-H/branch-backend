import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateMemberDto } from "../member/dto/member.dto";
import { MemberService } from "../member/member.service";
import { JwtPayload, LoginDto } from "./dto/auth.dto";
import { AuthService } from "./auth.service";
import { AuthenticatedUser } from "./guards/auth-user.decorator";
import { JwtGuard } from "./guards/jwt.guard";
import { RefreshGuard } from "./guards/refresh.guard";

@Controller("auth")
export class AuthController {

  constructor(
    private memberService: MemberService,
    private authService: AuthService
  ) {
  }

  @Post("register")
  async registerUser(@Body() dto: CreateMemberDto) {
    return await this.memberService.createUser(dto);
  }

  @Post("login")
  async loginUser(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(RefreshGuard)
  @Post("refresh")
  async refreshToken(@AuthenticatedUser() user: JwtPayload) {
    return this.authService.refreshToken(user);
  }

}
