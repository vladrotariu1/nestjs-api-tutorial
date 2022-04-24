import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from './decorators';

@Controller('users')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('me')
    me(@GetUser() user: User) {
        return user;
    }
}
