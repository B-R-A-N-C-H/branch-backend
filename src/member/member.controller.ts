import { Body, Controller, Delete, Get, Logger, Param, Patch, UseGuards } from "@nestjs/common";
import { AuthenticatedUser } from "../auth/guards/auth-user.decorator";
import { JwtPayload } from "../auth/dto/auth.dto";
import { MemberService } from "./member.service";
import Protected from "../auth/guards/protected.decorator";
import { Role } from "@prisma/client";
import { UpdateMemberDto, UpdateSelfMemberDto } from "./dto/member.dto";

@Controller("members")
export class MemberController {

  constructor(private memberService: MemberService) {
  }

  @Protected()
  @Get("@me")
  async getSelf(@AuthenticatedUser() authenticatedUser: JwtPayload) {
    return await this.memberService.findByEmail(
      { email: authenticatedUser.username },
      { excludePassword: true }
    );
  }

  @Protected(Role.ADMIN, Role.PRINCIPAL)
  @Patch(":id")
  async updateMember(@AuthenticatedUser() authUser: JwtPayload, @Param("id") id: string, @Body() dto: UpdateMemberDto) {
    return this.memberService.updateMember(authUser, id, dto);
  }

  @Protected()
  @Patch("@me")
  async updateSelf(@AuthenticatedUser() authUser: JwtPayload, @Body() dto: UpdateSelfMemberDto) {
    return this.memberService.updateSelfMember(authUser, dto);
  }

  @Protected(Role.ADMIN, Role.PRINCIPAL)
  @Delete(":id")
  async deleteMember(@AuthenticatedUser() authUser: JwtPayload, @Param("id") id: string) {
    return this.memberService.deleteMember(authUser, id);
  }

  @Protected()
  @Delete("@me")
  async deleteSelf(@AuthenticatedUser() authUser: JwtPayload) {
    return this.memberService.deleteSelfMember(authUser);
  }

}
