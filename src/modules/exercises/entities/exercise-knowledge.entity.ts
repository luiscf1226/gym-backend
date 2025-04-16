import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exercise } from './exercise.entity';

@Entity('exercise_knowledge')
export class ExerciseKnowledge {
  @ApiProperty({ description: 'Unique identifier of the exercise knowledge' })
  @PrimaryGeneratedColumn('uuid')
  knowledge_id: string;

  @ApiProperty({ description: 'ID of the exercise' })
  @Column({ type: 'uuid' })
  exercise_id: string;

  @ApiProperty({ description: 'Knowledge content about the exercise' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'Source of the knowledge' })
  @Column({ length: 255, nullable: true })
  source: string;

  @ApiProperty({ description: 'Vector embedding for similarity search' })
  @Column('jsonb', { nullable: true })
  vector_embedding: number[];

  @OneToOne(() => Exercise, (exercise) => exercise.knowledge)
  @JoinColumn({ name: 'exercise_id', referencedColumnName: 'exercise_id' })
  exercise: Exercise;
} 