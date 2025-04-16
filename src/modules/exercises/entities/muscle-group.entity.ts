import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('muscle_groups')
export class MuscleGroup {
  @ApiProperty({ description: 'Unique identifier of the muscle group' })
  @PrimaryGeneratedColumn('uuid')
  muscle_group_id: string;

  @ApiProperty({ description: 'Name of the muscle group' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Description of the muscle group' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ 
    description: 'Body region of the muscle group', 
    enum: ['upper', 'lower', 'core'] 
  })
  @Column({ 
    type: 'varchar',
    length: 20,
    enum: ['upper', 'lower', 'core']
  })
  body_region: string;
} 