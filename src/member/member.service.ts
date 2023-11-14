import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../utils/database/prisma.service";
import { CreateMemberDto, FindMemberByEmailDto } from "./dto/member.dto";
import { genSalt, hash } from "bcrypt";
import { Member } from "@prisma/client";

@Injectable()
export class MemberService {

  constructor(private prisma: PrismaService) {
  }

  async createUser(dto: CreateMemberDto) {
    const existingUser = await this.prisma.member.findUnique({
      where: {
        email: dto.email.toLowerCase()
      }
    });

    if (existingUser)
      throw new ConflictException("An account with that email already exists!");

    const salt = await genSalt(12);
    const hashedPassword = await hash(dto.password, salt);
    const createdUser = await this.prisma.member.create({
      data: {
        ...dto,
        password: hashedPassword
      }
    });

    const { password, ...result } = createdUser;
    return result;
  }

  async findByEmail(dto: FindMemberByEmailDto, options?: {
    excludePassword?: boolean,
  }): Promise<Omit<Member, "password"> & { password?: string }> {
    return this.prisma.member.findUnique({
      where: {
        email: dto.email.toLowerCase()
      },
      select: options?.excludePassword && {
        email: true,
        id: true,
        role: true,
        teachingLevel: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

}
