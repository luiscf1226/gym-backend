import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { User } from './modules/auth/entities/user.entity';
import { RefreshToken } from './modules/auth/entities/refresh-token.entity';
import { UserProfile } from './modules/users/entities/user-profile.entity';
import { Exercise } from './modules/exercises/entities/exercise.entity';
import { MuscleGroup } from './modules/exercises/entities/muscle-group.entity';
import { ExerciseMuscleGroup } from './modules/exercises/entities/exercise-muscle-group.entity';
import { ExerciseKnowledge } from './modules/exercises/entities/exercise-knowledge.entity';
import { ExerciseEquipment } from './modules/exercises/entities/exercise-equipment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ([
        {
          ttl: 60000, // 1 minute
          limit: 10,  // 10 requests per minute
          ignoreUserAgents: [/^postman/i], // Optionally ignore Postman for testing
        },
      ]),
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
          entities: [
            User, 
            RefreshToken, 
            UserProfile, 
            Exercise, 
            MuscleGroup, 
            ExerciseMuscleGroup, 
            ExerciseKnowledge,
            ExerciseEquipment
          ],
          synchronize: false,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false
            },
            poolMode: configService.get('DB_POOL_MODE')
          },
          logging: configService.get('NODE_ENV') === 'development',
          autoLoadEntities: false, // Set to false since we're explicitly listing entities
        };
      },
      inject: [ConfigService],
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    ExercisesModule,
  ],
})
export class AppModule {} 