import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

    @Protected()
    @Get("/entries")
    async getRegistrationEntries(@AuthenticatedUser() authUser: JwtPayload){
        return this.registrationService.getAllRegistrationEntries(authUser)
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER)
    @Get("/entries/:id")
    async getRegistrationEntryById(@Param("id") id: string){
        return this.registrationService.getRegistrationEntry(id)
    }

    @Protected()
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
    async approveRegistration(@Param("id") id: string, @Body() dto: ApproveRegistrationDto){
        return this.registrationService.approveRegistrationEntry(id, dto)
    }

    
    @Protected(Role.ADMIN, Role.PRINCIPAL)
    @Post('/periods')
    async createPeriod(@Body() dto: CreateRegistrationPeriodDto) {
        return this.registrationService.createRegistrationPeriod(dto);
    }

    @Protected()
    @Get('/periods')
    async getPeriods(@Query() query: FetchRegistrationPeriodsQueryDto) {
        return this.registrationService.getAllRegistrationPeriods(query.status);
    }

    @Protected()
    @Get('/periods/:id')
    async getPeriodById(@Param('id') id: string) {
        return this.registrationService.getRegistrationPeriod(id);
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL)
    @Delete('/periods/:id')
    async deletePeriodById(@AuthenticatedUser() authUser: JwtPayload, @Param('id') id: string) {
        return this.registrationService.deleteRegistrationPeriod(/*authUser, */ id);
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL)
    @Patch('/periods/:id')
    async updatePeriodById(@AuthenticatedUser() authUser: JwtPayload, @Param('id') id: string, @Body() dto: UpdateRegistrationPeriodDto) {
        return this.registrationService.updateRegistrationPeriod(/*authUser, */ id, dto);
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL)
    @Put("/documents")
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(@UploadedFile() file: Express.Multer.File){
        return this.registrationService.uploadDocument(file)
    }

    @Protected()
    @Get("/documents/:id")
    async getDocument(@Param('id') id: string){
        return this.registrationService.getDocument(id)
    }
    
    @Protected()
    @Get("/documents")
    async getDocuments(){
        return this.registrationService.getAllDocuments()
    }

    @Protected(Role.ADMIN, Role.PRINCIPAL)
    @Delete("/documents/:id")
    async deleteDocument(@Param("id") id: string){
        return this.registrationService.deleteDocument(id)
    }
}