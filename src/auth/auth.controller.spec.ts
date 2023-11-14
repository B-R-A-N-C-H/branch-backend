import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MemberService } from "../member/member.service";
import { AuthService } from "./auth.service";
import { PrismaService } from "../utils/database/prisma.service";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [JwtService, ConfigService, MemberService, AuthService, PrismaService]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
