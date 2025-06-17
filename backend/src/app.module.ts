import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FlightsModule } from './flights/flights.module';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { BookingsService } from './bookings/bookings.service';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [PrismaModule, FlightsModule, LoggerModule, AuthModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService, BookingsService],
})
export class AppModule {}
