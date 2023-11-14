import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { Config } from "../../utils/config/configuration";
import { JwtPayload } from "../dto/auth.dto";

@Injectable()
export class RefreshGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Config>
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    if (!token)
      throw new UnauthorizedException();

    try {
      req.user = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get("JWT_REFRESH_TOKEN_KEY")
      });
    } catch (e) {
      throw new UnauthorizedException();
    }


    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Refresh" ? token : undefined;
  }
}