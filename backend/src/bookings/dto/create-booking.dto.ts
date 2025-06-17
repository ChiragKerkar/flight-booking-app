import { IsInt, IsArray, ValidateNested, Min, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class PassengerDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsString()
  gender: string;
}

export class CreateBookingDto {
  @IsInt()
  flightId: number;

  @IsInt()
  @Min(1)
  numberOfSeats: number;

  @IsDateString()
  scheduledFlightDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers: PassengerDto[];
}
