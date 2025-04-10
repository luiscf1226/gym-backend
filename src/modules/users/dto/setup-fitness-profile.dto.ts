import { IsString, IsNumber, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum FitnessLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum PrimaryGoal {
  WEIGHT_LOSS = 'weight_loss',
  MUSCLE_GAIN = 'muscle_gain',
  ENDURANCE = 'endurance',
  STRENGTH = 'strength',
  FLEXIBILITY = 'flexibility',
  GENERAL_FITNESS = 'general_fitness',
  SPORTS_PERFORMANCE = 'sports_performance'
}

export class SetupFitnessProfileDto {
  @ApiProperty({ 
    description: 'User\'s fitness level',
    enum: FitnessLevel,
    example: FitnessLevel.INTERMEDIATE
  })
  @IsEnum(FitnessLevel)
  fitness_level: FitnessLevel;

  @ApiProperty({ 
    description: 'User\'s primary fitness goal',
    enum: PrimaryGoal,
    example: PrimaryGoal.MUSCLE_GAIN
  })
  @IsEnum(PrimaryGoal)
  primary_goal: PrimaryGoal;

  @ApiProperty({ 
    description: 'Preferred workout duration in minutes',
    minimum: 15,
    maximum: 180,
    example: 60
  })
  @IsInt()
  @Min(15)
  @Max(180)
  preferred_workout_duration: number;

  @ApiProperty({ 
    description: 'Number of workouts per week',
    minimum: 1,
    maximum: 7,
    example: 4
  })
  @IsInt()
  @Min(1)
  @Max(7)
  workout_frequency: number;
} 