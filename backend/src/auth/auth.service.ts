import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private logger: AppLoggerService
    ) { }

    async register(email: string, password: string, name: string) {
        this.logger.log(`AuthService: registering user`);
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.prisma.user.create({
                data: { email, password: hashedPassword, name },
            });
            return { message: 'User registered successfully'};
        } catch (error) {
            throw new InternalServerErrorException('Failed to register user.');
        }

    }

    async validateUser(email: string, pass: string) {
        this.logger.log(`AuthService: Validating user`);
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (user && await bcrypt.compare(pass, user.password)) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            throw new InternalServerErrorException('Failed to validate user.');
        }

    }

    async login(user: any) {
        this.logger.log(`AuthService: Login user`);
        try {
            const payload = { email: user.email, sub: user.id };
            return {
                access_token: this.jwtService.sign(payload),
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to login user.');
        }

    }
}
