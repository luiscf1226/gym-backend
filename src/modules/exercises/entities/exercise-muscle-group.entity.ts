import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exercise } from './exercise.entity';
import { MuscleGroup } from './muscle-group.entity';

@Entity('exercise_muscle_groups')
export class ExerciseMuscleGroup {
  @ApiProperty({ description: 'Unique identifier of the exercise-muscle group relationship' })
  @PrimaryGeneratedColumn('uuid')
  exercise_muscle_id: string;

  @ApiProperty({ description: 'ID of the exercise' })
  @Column({ type: 'uuid' })
  exercise_id: string;

  @ApiProperty({ description: 'ID of the muscle group' })
  @Column({ type: 'uuid' })
  muscle_group_id: string;

  @ApiProperty({ description: 'Whether this is a primary muscle group for the exercise' })
  @Column()
  is_primary: boolean;

  @ManyToOne(() => Exercise, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @ManyToOne(() => MuscleGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'muscle_group_id' })
  muscle_group: MuscleGroup;
} 