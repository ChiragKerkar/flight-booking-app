import { Controller, Get, InternalServerErrorException, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { SearchFlightDto } from './dto/search-flight.dto';
import { Response, Request } from 'express';
import { AppLoggerService } from 'src/logger/logger.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('flights')
export class FlightsController {
    constructor(private readonly flightService: FlightsService, private logger: AppLoggerService) { }

    @UseGuards(JwtAuthGuard)
    @Get('search')
    async searchFlights(@Query() query: SearchFlightDto, @Res() res: Response, @Req() req: Request) {
        const { origin, destination, date, passengers } = query;
        const searchDate = new Date(date);

        try {
            const flights = await this.flightService.searchFlights(origin, destination, searchDate, passengers);

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
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('origins')
    async getOrigins(@Res() res: Response) {
        try {
            const origins = await this.flightService.getDistinctOrigins();
            if (origins.length === 0) {
                return res.status(200).json({
                    message: 'No origins found.',
                    data: [],
                });
            }
            return res.status(200).json({
                message: 'Origins fetched successfully.',
                data: origins,
            });
        } catch (error) {
            this.logger.error(
                'FlightsController: Failed to fetch origins.',
                error.stack,
            );
            throw new InternalServerErrorException({
                message: 'Failed to fetch origins.',
                error: error.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('destinations')
    async getDestinations(@Res() res: Response) {
        try {
            const destinations = await this.flightService.getDistinctDestinations();

            if (destinations.length === 0) {
                return res.status(200).json({
                    message: 'No destinations found.',
                    data: [],
                });
            }

            return res.status(200).json({
                message: 'Destinations fetched successfully.',
                data: destinations,
            });
        } catch (error) {
            this.logger.error(
                'FlightsController: Failed to fetch destinations.',
                error.stack,
            );
            throw new InternalServerErrorException({
                message: 'Failed to fetch destinations.',
                error: error.message,
            });
        }
    }
}
