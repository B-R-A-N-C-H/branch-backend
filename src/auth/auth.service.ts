import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload, LoginDto } from "./dto/auth.dto";
import { MemberService } from "../member/member.service";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Config } from "../utils/config/configuration";

/**
 * The TTL for a token in milliseconds.
 */
const MAX_TOKEN_AGE = 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {

  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
    private configService: ConfigService<Config>
  ) {
  }

  async login(dto: LoginDto) {
    const member = await this.validateMember(dto);
    const payload: JwtPayload = {
      username: member.email,
      sub: { name: member.firstName, lastName: member.lastName, role: member.role }
    };

    return {
      member,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: "1d",
          secret: this.configService.get("JWT_SECRET")
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: "7d",
          secret: this.configService.get("JWT_REFRESH_TOKEN_KEY")
        }),
        expiresIn: new Date().setTime(Date.now() + MAX_TOKEN_AGE)
      }
    };

  }

  private async validateMember(dto: LoginDto) {
    const member = await this.memberService.findByEmail({ email: dto.email });

    if (member && (await compare(dto.password, member.password))) {
      const { password, ...user } = member;
      return user;
    } else throw new UnauthorizedException("Invalid email/password!");
  }

  async refreshToken(user: JwtPayload) {
    const payload: JwtPayload = { ...user };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: "1d",
        secret: this.configService.get("JWT_SECRET")
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: "7d",
        secret: this.configService.get("JWT_REFRESH_TOKEN_KEY")
      }),
      expiresIn: new Date().setTime(Date.now() + MAX_TOKEN_AGE)
    };
  }

}
