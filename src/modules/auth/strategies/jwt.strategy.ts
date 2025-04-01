import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { user_id: payload.sub, is_active: true }
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      user_id: payload.sub,
      email: payload.email,
      is_active: payload.is_active,
      subscription_tier: payload.subscription_tier,
      ai_features_included: payload.ai_features_included,
      max_workouts_per_month: payload.max_workouts_per_month,
    };
  }
} 