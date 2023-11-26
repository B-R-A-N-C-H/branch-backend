import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Role } from "@prisma/client";
import { JwtPayload } from "src/auth/dto/auth.dto";
import { AuthenticatedUser } from "src/auth/guards/auth-user.decorator";
import Protected, { Roles } from "src/auth/guards/protected.decorator";
import { CreateRegistrationDto, CreateRegistrationPeriodDto } from "./dto/registration.dto";
import { RegistrationService } from "./registration.service";



@Controller("registration")
export class RegistrationController {
    constructor(private registrationService: RegistrationService) { }

    @Protected()
    @Post("/entries")
    async registerChild(@AuthenticatedUser() authUser: JwtPayload, @Body() dto: CreateRegistrationDto) {
        return this.registrationService.createRegistration(authUser, dto)
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL)
    @Post("/periods")
    async createPeriod(@AuthenticatedUser() authUser: JwtPayload, @Body() dto: CreateRegistrationPeriodDto) {
        return this.registrationService.createRegistrationPeriod(authUser, dto)
    }

    //@Protected()
    @Get("/periods")
    async getPeriods(@AuthenticatedUser() authUser: JwtPayload) {
        return this.registrationService.getAllRegistrationPeriods(authUser)
    }

    //@Protected()
    @Get("/periods/:id")
    async getPeriodById(/*@AuthenticatedUser() authUser: JwtPayload,*/ @Param("id") id: string) {
        return this.registrationService.getRegistrationPeriod(/*authUser,*/ id)
    }

    //@Protected(Role.ADMIN, Role.PRINCIPAL)
    @Delete("/periods/:id")
    async deletePeriodById(/*@AuthenticatedUser() authUser: JwtPayload, */ @Param("id") id: string) {
        return this.registrationService.deleteRegistrationPeriod(/*authUser, */ id)
    }
}