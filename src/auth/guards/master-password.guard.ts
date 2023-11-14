import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Config } from "../../utils/config/configuration";
import { Request } from "express";

@Injectable()
export class MasterPasswordGuard implements CanActivate {

  constructor(private configService: ConfigService<Config>) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const password = this.extractPasswordFromHeader(req);

    if (!password)
      throw new UnauthorizedException();
    return password === this.configService.get("JWT_SECRET");

  }

  private extractPasswordFromHeader(req: Request): string | undefined {
    const [type, password] = req.headers.authorization?.split(" ") ?? [];
    return type === "Password" ? password : undefined;
  }
}