import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CheckExistingBookingDto {
  @IsInt({ message: 'Flight ID must be an integer.' })
  flightId: number;

  @IsNotEmpty({ message: 'Scheduled flight date is required.' })
  @IsDateString({}, { message: 'Scheduled flight date must be a valid ISO date string.' })
  scheduledFlightDate: string;
}