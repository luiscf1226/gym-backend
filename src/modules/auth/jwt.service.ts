import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from './entities/user.entity';

interface JwtPayload {
  sub: string;
  email: string;
  is_active: boolean;
  subscription_tier?: string;
  ai_features_included?: boolean;
  max_workouts_per_month?: number;
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const refresh_token = uuidv4();
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 30); // 30 days from now

    await this.refreshTokenRepository.save({
      refresh_token,
      expires_at,
      user_id: userId,
      is_revoked: false,
    });

    return refresh_token;
  }

  async verifyRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { refresh_token: token, is_revoked: false },
      relations: ['user'],
    });

    if (!refreshToken) {
      return false;
    }

    if (new Date() > refreshToken.expires_at) {
      await this.refreshTokenRepository.remove(refreshToken);
      return false;
    }

    return true;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { refresh_token: token },
      { is_revoked: true }
    );
  }
} 