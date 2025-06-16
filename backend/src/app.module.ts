import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FlightsModule } from './flights/flights.module';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, FlightsModule, LoggerModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
