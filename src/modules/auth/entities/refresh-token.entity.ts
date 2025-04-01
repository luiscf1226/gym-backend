import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  token_id: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column({ name: 'refresh_token', unique: true })
  refresh_token: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expires_at: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @Column({ name: 'is_revoked', type: 'boolean', default: false })
  is_revoked: boolean;

  @ManyToOne(() => User, user => user.refresh_tokens)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 