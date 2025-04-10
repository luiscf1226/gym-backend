import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn('uuid')
  user_id: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ nullable: true })
  fitness_level: string;

  @Column({ nullable: true })
  primary_goal: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences: Record<string, any>;

  @Column({ default: false })
  setup_completed: boolean;

  @Column({ type: 'integer', nullable: true })
  preferred_workout_duration: number;

  @Column({ type: 'integer', nullable: true })
  workout_frequency: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 