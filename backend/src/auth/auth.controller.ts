import { Controller, Post, Body, Request, UseGuards, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AppLoggerService } from 'src/logger/logger.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private logger: AppLoggerService) { }

    @Post('register')
    async register(@Body() body: { email: string, password: string, name: string }) {
        try {
            return await this.authService.register(body.email, body.password, body.name);
        } catch (error) {
            this.logger.error(
                'AuthController: Failed to register user.',
                error.stack,
            );
            throw new InternalServerErrorException({
                message: 'Failed to register user.',
                error: error.message,
            });
        }
    }

    @Post('login')
    async login(@Body() body: { email: string, password: string }) {
        try {

            const user = await this.authService.validateUser(body.email, body.password);
            if (!user) throw new UnauthorizedException('Invalid credentials');
            return this.authService.login(user);

        } catch (error) {
            this.logger.error(
                'AuthController: Failed to login user.',
                error.stack,
            );
            throw new InternalServerErrorException({
                message: 'Failed to login user.',
                error: error.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile')
    getProfile(@Request() req) {
        try {
            return req.user;
        } catch (error) {
            this.logger.error(
                'AuthController: Failed to fetch user profile.',
                error.stack,
            );
            throw new InternalServerErrorException({
                message: 'Failed to fetch user profile.',
                error: error.message,
            });
        }
    }
}
