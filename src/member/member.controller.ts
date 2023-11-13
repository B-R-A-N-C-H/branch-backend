import { Controller, Get, Logger, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { AuthenticatedUser } from "../auth/guards/auth-user.decorator";
import { JwtPayload } from "../auth/dto/auth.dto";
import { MemberService } from "./member.service";

@Controller("member")
export class MemberController {

  constructor(private memberService: MemberService) {
  }

  @UseGuards(JwtGuard)
  @Get("@me")
  async getSelf(@AuthenticatedUser() authenticatedUser: JwtPayload) {
    return await this.memberService.findByEmail(
      { email: authenticatedUser.username },
      { excludePassword: true }
    );
  }
}
