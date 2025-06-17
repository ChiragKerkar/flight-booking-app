import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports:[PrismaModule, LoggerModule],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
