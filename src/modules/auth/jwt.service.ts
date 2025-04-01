import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { TokenPayload, RefreshTokenPayload } from './interfaces/auth.interface';

@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async generateTokens(user: User): Promise<{ access_token: string; refresh_token: string }> {
    const payload: TokenPayload = {
      sub: user.user_id,
      email: user.email,
      is_active: user.is_active,
    };

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtExpiration = this.configService.get<string>('JWT_EXPIRATION');

    if (!jwtSecret || !jwtExpiration) {
      throw new Error('JWT configuration is missing');
    }

    const access_token = this.nestJwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiration,
    });

    const refresh_token = await this.generateRefreshToken(user);

    return {
      access_token,
      refresh_token,
    };
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const token_id = uuidv4();
    const refreshSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
    const refreshExpiration = this.configService.get<string>('REFRESH_TOKEN_EXPIRATION');

    if (!refreshSecret || !refreshExpiration) {
      throw new Error('Refresh token configuration is missing');
    }

    // Generate a shorter token using UUID and hash
    const tokenBase = `${token_id}${user.user_id}${Date.now()}`;
    const refresh_token = createHash('sha256')
      .update(tokenBase + refreshSecret)
      .digest('hex')
      .substring(0, 64); // Use first 64 chars of hash for reasonable length

    // Parse expiration duration (e.g., "7d" to number of days)
    const days = parseInt(refreshExpiration.replace(/[^0-9]/g, ''));
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + days);

    // Store the hashed token in the database
    await this.refreshTokenRepository.save({
      token_id,
      user_id: user.user_id,
      refresh_token,
      expires_at,
    });

    return refresh_token;
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      // Look up the token directly
      const refreshToken = await this.refreshTokenRepository.findOne({
        where: {
          refresh_token: token,
          is_revoked: false,
        },
        relations: ['user'],
      });

      if (!refreshToken || !refreshToken.user) {
        throw new UnauthorizedException('Refresh token not found or revoked');
      }

      // Check if token is expired
      if (refreshToken.expires_at < new Date()) {
        await this.revokeRefreshToken(refreshToken.token_id);
        throw new UnauthorizedException('Refresh token has expired');
      }

      return {
        user_id: refreshToken.user_id,
        token_id: refreshToken.token_id,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(token_id: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token_id },
      { is_revoked: true },
    );
  }
} 