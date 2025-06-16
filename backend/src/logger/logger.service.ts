import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppLoggerService implements LoggerService {
    private logger: winston.Logger;

    constructor(private prisma: PrismaService) {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(({ level, message, timestamp, file }) => {
                    return `${timestamp} [${level.toUpperCase()}] [${file}]: ${message}`;
                }),
            ),
            transports: [
                new winston.transports.Console(),

                new DailyRotateFile({
                    filename: 'logs/%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '90d',
                    zippedArchive: true,
                }),
            ],

        });
    }

    private getCallerFile(): string {
        const stack = new Error().stack?.split('\n') || [];
        // Find the first stack trace entry outside logger.service.ts
        const callerStack =
            stack.find(
                (line) => !line.includes('logger.service.ts') && line.includes('.ts:'),
            ) || '';
        const filePathMatch = callerStack.match(/\((.*?):\d+:\d+\)/);
        return filePathMatch && filePathMatch[1]
            ? path.basename(filePathMatch[1])
            : 'Unknown File';
    }

    private async logToDatabase(level: string, message: string, file: string) {
        try {
            await this.prisma.audit_trail.create({
                data: {
                    level,
                    message,
                    file,
                },
            });
        } catch (err) {
            console.warn('Failed to write log to database:', err.message);
        }
    }



    log(message: string) {
        const file = this.getCallerFile();
        this.logger.info({ message, file });
        this.logToDatabase('info', message, file);
    }

    error(message: string, trace?: string) {
        const file = this.getCallerFile();
        const fullMessage = `${message}${trace ? '\nTrace: ' + trace : ''}`;
        this.logger.error({ message: fullMessage, file });
        this.logToDatabase('error', fullMessage, file);
    }

    warn(message: string) {
        const file = this.getCallerFile();
        this.logger.warn({ message, file });
        this.logToDatabase('warn', message, file);
    }

    debug(message: string) {
        const file = this.getCallerFile();
        this.logger.debug({ message, file });
        this.logToDatabase('debug', message, file);
    }

    verbose(message: string) {
        const file = this.getCallerFile();
        this.logger.verbose({ message, file });
        this.logToDatabase('verbose', message, file);
    }

}
