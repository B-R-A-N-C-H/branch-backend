import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PrismaService } from "../utils/database/prisma.service";
import { CreateMemberDto, FindMemberByEmailDto, UpdateMemberDto, UpdateSelfMemberDto } from "./dto/member.dto";
import { genSalt, hash } from "bcrypt";
import { Member, Role } from "@prisma/client";
import { JwtPayload } from "../auth/dto/auth.dto";

@Injectable()
export class MemberService {

  constructor(private prisma: PrismaService) {
  }

  async createUser(dto: CreateMemberDto, role: Role | null = null) {
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
        ...dto, role,
        password: hashedPassword
      }
    });

    const { password, ...result } = createdUser;
    return result;
  }

  async findAll() {
    return this.prisma.member.findMany();
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

  async findById(id: string, options?: {
    excludePassword?: boolean,
  }) {
    return this.prisma.member.findUnique({
      where: { id },
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

  async updateMember(selfUser: JwtPayload, memberId: string, dto: UpdateMemberDto) {
    if (dto.role && (dto.role === Role.ADMIN || dto.role === Role.PRINCIPAL) && selfUser.sub.role !== Role.ADMIN)
      throw new ForbiddenException("You can't give anyone that permission!");

    return this.prisma.member.findUnique({
      where: {
        id: memberId
      }
    }).then(member => {
      if (!member)
        throw new BadRequestException("There is no user with that ID!");

      return this.prisma.member.update({
        where: {
          id: memberId
        },
        data: dto
      });
    });
  }

  async updateSelfMember(user: JwtPayload, dto: UpdateSelfMemberDto) {
    return this.updateMember(user, user.sub.id, dto);
  }

  async deleteMember(selfUser: JwtPayload, memberId: string) {
    const member = await this.findById(memberId);
    if (!member)
      throw new NotFoundException("There is no such user with that ID!");

    if ((member.role === Role.ADMIN || member.role === Role.PRINCIPAL)
      && selfUser.sub.role !== Role.ADMIN
      && (member.id !== selfUser.sub.id)
    )
      return;

    return this.prisma.member.delete({
      where: {
        id: memberId
      }
    });
  }

  async deleteSelfMember(selfUser: JwtPayload) {
    return this.deleteMember(selfUser, selfUser.sub.id);
  }

}
