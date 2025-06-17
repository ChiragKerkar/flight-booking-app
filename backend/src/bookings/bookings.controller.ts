import { Body, Controller, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Response, Request } from 'express';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AppLoggerService } from 'src/logger/logger.service';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingService: BookingsService, private logger: AppLoggerService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createBooking(@Req() req: RequestWithUser, @Res() res: Response, @Body() dto: CreateBookingDto) {
        try {
            const bookFlight = await this.bookingService.createBooking(req.user.userId, dto);
            return res.status(201).json({
                message: "Your flight has been booked successfully.",
                data: bookFlight
            }
            );
        } catch (error) {
            this.logger.error('BookingsController: Failed to create booking.', error.stack);
            throw new InternalServerErrorException('Failed to create booking.');
        }
    }
}
