import { IsString, IsNumber, IsDate, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export class SetupBasicProfileDto {
  @ApiProperty({ description: 'User\'s first name' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'User\'s last name' })
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'User\'s date of birth', example: '1990-01-01' })
  @Type(() => Date)
  @IsDate()
  date_of_birth: Date;

  @ApiProperty({ 
    description: 'User\'s gender',
    enum: Gender,
    example: Gender.MALE
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: 'User\'s height in centimeters', minimum: 100, maximum: 250 })
  @IsNumber()
  @Min(100)
  @Max(250)
  height: number;

  @ApiProperty({ description: 'User\'s weight in kilograms', minimum: 30, maximum: 300 })
  @IsNumber()
  @Min(30)
  @Max(300)
  weight: number;
} 