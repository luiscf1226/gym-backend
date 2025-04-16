import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exercise } from './exercise.entity';

@Entity('exercise_equipment')
export class ExerciseEquipment {
  @ApiProperty({ description: 'Unique identifier of the exercise-equipment relationship' })
  @PrimaryGeneratedColumn('uuid')
  exercise_equipment_id: string;

  @ApiProperty({ description: 'ID of the exercise' })
  @Column({ type: 'uuid' })
  exercise_id: string;

  @ApiProperty({ description: 'ID of the equipment' })
  @Column({ type: 'uuid' })
  equipment_id: string;

  @ApiProperty({ description: 'Whether this equipment is required for the exercise' })
  @Column()
  is_required: boolean;

  @ManyToOne(() => Exercise, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;
} 