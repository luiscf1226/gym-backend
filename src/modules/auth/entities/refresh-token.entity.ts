import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  token_id: string;

  @Column()
  user_id: string;

  @Column({ unique: true })
  refresh_token: string;

  @Column({ type: 'timestamptz' })
  expires_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ default: false })
  is_revoked: boolean;

  @ManyToOne(() => User, user => user.refresh_tokens)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 