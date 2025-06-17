import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { take } from 'rxjs';
import { AppLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FlightsService {
    constructor(private prisma: PrismaService,
        private logger: AppLoggerService
    ) { }

    async searchFlights(
        origin: string,
        destination: string,
        date: Date,
        passengers: number,
    ) {

        const page = parseInt(process.env.DEFAULT_PAGE || '1', 10);
        const limit = parseInt(process.env.DEFAULT_LIMIT || '10', 10);
        const skip = (page - 1) * limit;


        this.logger.log(`FlightsService: Fetching Flights (page: ${page}, limit: ${limit})`,
        );
        const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)

        try {
            const whereClause = {
                origin,
                destination,
                available_seats: {
                    gte: passengers,
                },
                operationalDays: {
                    some: {
                        day: dayOfWeek,
                    },
                },
            };

            const [flights, total] = await this.prisma.$transaction([
                this.prisma.flight.findMany({
                    where: whereClause,
                    skip,
                    take: limit,
                    include: {
                        operationalDays: true,
                    },
                }),
                this.prisma.flight.count({
                    where: whereClause,
                }),
            ]);

            return {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                data: flights,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Failed to fetch flights.',
                error: error.message,
            });
        }
    }
}
