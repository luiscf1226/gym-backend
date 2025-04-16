import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ExerciseMuscleGroup } from './exercise-muscle-group.entity';
import { ExerciseKnowledge } from './exercise-knowledge.entity';
import { ExerciseEquipment } from './exercise-equipment.entity';

@Entity('exercises')
export class Exercise {
  @ApiProperty({ description: 'Unique identifier of the exercise' })
  @PrimaryGeneratedColumn('uuid')
  exercise_id: string;

  @ApiProperty({ description: 'Name of the exercise' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'Description of the exercise' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Instructions for performing the exercise' })
  @Column({ type: 'text', nullable: true })
  instructions: string;

  @ApiProperty({ description: 'Difficulty level of the exercise', enum: ['beginner', 'intermediate', 'advanced'] })
  @Column({ 
    type: 'varchar',
    length: 20,
    enum: ['beginner', 'intermediate', 'advanced']
  })
  difficulty: string;

  @ApiProperty({ description: 'Whether this is a standard exercise' })
  @Column()
  is_standard: boolean;

  @ApiProperty({ description: 'ID of the user who created this exercise' })
  @Column({ type: 'uuid', nullable: true })
  created_by_user_id: string;

  @ApiProperty({ description: 'URL to the exercise video' })
  @Column({ length: 255, nullable: true })
  video_url: string;

  @ApiProperty({ description: 'URL to the exercise image' })
  @Column({ length: 255, nullable: true })
  image_url: string;

  @ApiProperty({ description: 'Vector embedding for similarity search' })
  @Column('jsonb', { nullable: true })
  vector_embedding: number[];

  @OneToMany(() => ExerciseMuscleGroup, (exerciseMuscleGroup) => exerciseMuscleGroup.exercise)
  muscleGroups: ExerciseMuscleGroup[];

  @OneToOne(() => ExerciseKnowledge, (exerciseKnowledge) => exerciseKnowledge.exercise)
  @JoinColumn({ name: 'exercise_id', referencedColumnName: 'exercise_id' })
  knowledge: ExerciseKnowledge;

  @OneToMany(() => ExerciseEquipment, (exerciseEquipment) => exerciseEquipment.exercise)
  equipment: ExerciseEquipment[];
} 