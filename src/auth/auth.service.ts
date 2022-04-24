import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { DbClientService } from 'src/db-client/db-client.service';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
    constructor(
        private dbClientService: DbClientService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async login(dto: AuthDto) {
        const user = await this.dbClientService.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) throw new ForbiddenException('Invalid credentials');

        const pwMatches = await argon.verify(user.hash, dto.password);

        if (!pwMatches) throw new ForbiddenException('Invalid credentials');

        const token = this.signToken(user.id, user.email);

        return token;
    }

    async signup(dto: AuthDto) {
        try {
            const hash = await argon.hash(dto.password);

            const user = await this.dbClientService.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });

            delete user.hash;

            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                switch (error.code) {
                    case 'P2002':
                        throw new ForbiddenException('Credentials taken');
                    default:
                        throw error;
                }
            }
        }
    }

    signToken(userId: number, email: string): { access_token: string } {
        const payload = {
            sub: userId,
            email: email,
        };

        const secret = this.configService.get('JWT_SECRET');

        const token = this.jwtService.sign(payload, {
            expiresIn: '15m',
            secret: secret,
        });

        return { access_token: token };
    }
}
