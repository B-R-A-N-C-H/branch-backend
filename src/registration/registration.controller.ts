import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtPayload } from 'src/auth/dto/auth.dto';
import { AuthenticatedUser } from 'src/auth/guards/auth-user.decorator';
import Protected from 'src/auth/guards/protected.decorator';
import {
    CreateRegistrationDto,
    CreateRegistrationPeriodDto, FetchRegistrationPeriodsQueryDto,
    UpdateRegistrationPeriodDto, ApproveRegistrationDto, UpdateRegistrationDto 
} from './dto/registration.dto';
import { RegistrationService } from './registration.service';


@Controller('registration')
export class RegistrationController {
    constructor(private registrationService: RegistrationService) {
    }

    @Protected()
    @Post('/entries')
    async registerChild(@AuthenticatedUser() authUser: JwtPayload, @Body() dto: CreateRegistrationDto) {
        return this.registrationService.createRegistration(authUser, dto);
    }

    //@Protected(Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER)
    @Get("/entries")
    async getRegistrationEntries(){
        return this.registrationService.getAllRegistrationEntries()
    }

    //@Protected(Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER)
    @Get("/entries/:id")
    async getRegistrationEntryById(@Param("id") id: string){
        return this.registrationService.getRegistrationEntry(id)
    }

    //@Protected()
    @Patch("/entries/:id")
    async updateRegistrationEntryById(@Param("id") id: string, @Body() dto: UpdateRegistrationDto){
        return this.registrationService.updateRegistrationEntry(id, dto)
    }

    @Protected()
    @Delete("/entries/:id")
    async deleteRegistrationEntryById(@AuthenticatedUser() authUser: JwtPayload, @Param("id") id: string){
        return this.registrationService.deleteRegistrationEntry(authUser, id)
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL, Role.TEACHER)
    @Post("/entries/:id/review")
    async approveRegistration(@Param("id") id: string, dto: ApproveRegistrationDto){
        return this.registrationService.approveRegistrationEntry(id, dto)
    }

    
    @Protected(Role.ADMIN, Role.PRINCIPAL)
    @Post('/periods')
    async createPeriod(@AuthenticatedUser() authUser: JwtPayload, @Body() dto: CreateRegistrationPeriodDto) {
        return this.registrationService.createRegistrationPeriod(authUser, dto);
    }

    @Protected()
    @Get('/periods')
    async getPeriods(@Query() query: FetchRegistrationPeriodsQueryDto) {
        return this.registrationService.getAllRegistrationPeriods(query.status);
    }

    @Protected()
    @Get('/periods/:id')
    async getPeriodById(@AuthenticatedUser() authUser: JwtPayload, @Param('id') id: string) {
        return this.registrationService.getRegistrationPeriod(/*authUser,*/ id);
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL)
    @Delete('/periods/:id')
    async deletePeriodById(@AuthenticatedUser() authUser: JwtPayload, @Param('id') id: string) {
        return this.registrationService.deleteRegistrationPeriod(/*authUser, */ id);
    }

    @Patch('/periods/:id')
    async updatePeriodById(@AuthenticatedUser() authUser: JwtPayload, @Param('id') id: string, @Body() dto: UpdateRegistrationPeriodDto) {
        return this.registrationService.updateRegistrationPeriod(/*authUser, */ id, dto);
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL)
    @Put("documents")
    async uploadDocument(/*AuthenticatedUser() authUser: JwtPayload, */){}
    
}