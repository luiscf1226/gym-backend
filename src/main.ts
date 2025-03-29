import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
          }),
        ),
      }),
      new winston.transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // Basic CORS setup
  app.enableCors();

  // Swagger setup - as simple as possible
  const config = new DocumentBuilder()
    .setTitle('Gym App API')
    .setDescription('Gym App API Documentation')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  // Global prefix for API routes
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Swagger documentation is available at: http://localhost:3000/docs');
}

bootstrap(); 