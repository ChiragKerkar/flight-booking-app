import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AppLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService, private logger: AppLoggerService) { }

    async createBooking(userId: number, dto: CreateBookingDto) {
        const { flightId, numberOfSeats, passengers, scheduledFlightDate } = dto;

        const flight = await this.prisma.flight.findUnique({
            where: { id: flightId },
        });

        if (!flight) throw new NotFoundException('Flight not found');
        if (flight.available_seats < numberOfSeats) {
            throw new BadRequestException('Not enough seats available');
        }

        try {
            return await this.prisma.$transaction(async (tx) => {
                const booking = await tx.booking.create({
                    data: {
                        userId,
                        flightId,
                        number_of_seats: numberOfSeats,
                        scheduled_flight_date: new Date(scheduledFlightDate),
                        passengers: {
                            create: passengers.map((p) => ({
                                name: p.name,
                                age: p.age,
                                gender: p.gender,
                            })),
                        },
                    },
                    include: { passengers: true, flight: true },
                });

                await tx.flight.update({
                    where: { id: flightId },
                    data: { available_seats: { decrement: numberOfSeats } },
                });

                return booking;
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Booking failed.',
                error: error.message,
            });
        }
    }
}
