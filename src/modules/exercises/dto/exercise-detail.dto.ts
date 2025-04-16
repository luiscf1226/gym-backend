import { ApiProperty } from '@nestjs/swagger';

export class MuscleGroupDto {
  @ApiProperty({ description: 'Unique identifier of the muscle group' })
  muscle_group_id: string;

  @ApiProperty({ description: 'Name of the muscle group' })
  name: string;

  @ApiProperty({ description: 'Description of the muscle group' })
  description: string;

  @ApiProperty({ description: 'Body region of the muscle group' })
  body_region: string;

  @ApiProperty({ description: 'Whether this is a primary muscle group for the exercise' })
  is_primary: boolean;
}

export class ExerciseKnowledgeDto {
  @ApiProperty({ description: 'Knowledge content about the exercise' })
  content: string;

  @ApiProperty({ description: 'Source of the knowledge' })
  source: string;
}

export class ExerciseDetailDto {
  @ApiProperty({ description: 'Unique identifier of the exercise' })
  exercise_id: string;

  @ApiProperty({ description: 'Name of the exercise' })
  name: string;

  @ApiProperty({ description: 'Description of the exercise' })
  description: string;

  @ApiProperty({ description: 'Instructions for performing the exercise' })
  instructions: string;

  @ApiProperty({ description: 'Difficulty level of the exercise' })
  difficulty: string;

  @ApiProperty({ description: 'Whether this is a standard exercise' })
  is_standard: boolean;

  @ApiProperty({ description: 'ID of the user who created this exercise' })
  created_by_user_id: string;

  @ApiProperty({ description: 'URL to the exercise video' })
  video_url: string;

  @ApiProperty({ description: 'URL to the exercise image' })
  image_url: string;

  @ApiProperty({ description: 'Muscle groups targeted by this exercise', type: [MuscleGroupDto] })
  muscle_groups: MuscleGroupDto[];

  @ApiProperty({ description: 'Knowledge about this exercise', type: ExerciseKnowledgeDto })
  knowledge?: ExerciseKnowledgeDto;
} 