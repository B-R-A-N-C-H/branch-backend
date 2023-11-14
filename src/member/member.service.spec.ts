import { Test, TestingModule } from "@nestjs/testing";
import { MemberService } from "./member.service";
import { PrismaService } from "../utils/database/prisma.service";

describe("MemberService", () => {
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberService, PrismaService]
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
