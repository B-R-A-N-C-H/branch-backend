import { Reflector } from "@nestjs/core";
import {Role} from "@prisma/client"

export const Protected = Reflector.createDecorator<Role>();