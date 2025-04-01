import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/auth/entities/user.entity';
import { RefreshToken } from './modules/auth/entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const port = configService.get('DB_PORT');
        if (!port) throw new Error('Database port is not configured');

        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: parseInt(port),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [User, RefreshToken],
          synchronize: false,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false
            },
            poolMode: configService.get('DB_POOL_MODE')
          },
          logging: configService.get('NODE_ENV') === 'development',
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    HealthModule,
    AuthModule,
  ],
})
export class AppModule {} 