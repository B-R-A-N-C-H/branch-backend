import { Test, TestingModule } from "@nestjs/testing";
import { MemberController } from "./member.controller";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MemberService } from "./member.service";
import { PrismaService } from "../utils/database/prisma.service";

describe("MemberController", () => {
  let controller: MemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [JwtService, ConfigService, MemberService, PrismaService]
    }).compile();

    controller = module.get<MemberController>(MemberController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
