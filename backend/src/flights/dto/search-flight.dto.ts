import { IsString, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchFlightDto {
  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsDateString()
  date: string; // ISO date string (e.g., "2025-06-17")

  @Type(() => Number)
  @IsInt()
  @Min(1)
  passengers: number;
}