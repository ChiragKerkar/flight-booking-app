import { Controller, Get, InternalServerErrorException, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { SearchFlightDto } from './dto/search-flight.dto';
import { Response, Request } from 'express';
import { AppLoggerService } from 'src/logger/logger.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('flights')
export class FlightsController {
    constructor(private readonly flightsService: FlightsService, private logger: AppLoggerService) { }

    @UseGuards(JwtAuthGuard)
    @Get('search')
    async searchFlights(@Query() query: SearchFlightDto, @Res() res: Response, @Req() req: Request) {
        const { origin, destination, date, passengers } = query;
        const searchDate = new Date(date);

        try {
            const flights = await this.flightsService.searchFlights(origin, destination, searchDate, passengers);

            if (flights.data.length === 0) {
                return res.status(200).json({
                    message: 'No flights found for the given criteria.',
                    data: [],
                });
            }

            return res.status(200).json(flights);
        } catch (error) {
            this.logger.error(
                'FlightsController: Failed to fetch flights.',
                error.stack,
            );
            throw new InternalServerErrorException({
                message: 'Failed to fetch flights.',
                error: error.message,
            })
        }

    }
}
