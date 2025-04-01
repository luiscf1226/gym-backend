import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { SignUpResponse } from './interfaces/auth.interface';
import { JwtService } from './jwt.service';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    const { email, password } = signUpDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      // Hash password
      const salt = await bcrypt.genSalt();
      const password_hash = await bcrypt.hash(password, salt);

      // Create new user
      const user = await this.userRepository.save({
        email,
        password_hash,
        is_active: true
      });

      // Generate tokens
      const accessToken = await this.jwtService.generateAccessToken({
        sub: user.user_id,
        email: user.email,
        is_active: user.is_active
      });
      const refreshToken = await this.jwtService.generateRefreshToken(user.user_id);

      // Return user data with tokens
      return {
        user_id: user.user_id,
        email: user.email,
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async login(loginDto: LoginDto) {
    // Find user by email with subscription status
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user_subscription_status', 'uss', 'uss.user_id = user.user_id')
      .select([
        'user.user_id as user_id',
        'user.email as user_email',
        'user.password_hash as user_password_hash',
        'user.is_active as user_is_active',
        'uss.tier_name as subscription_tier',
        'uss.ai_features_included',
        'uss.max_workouts_per_month'
      ])
      .where('user.email = :email', { email: loginDto.email })
      .getRawOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify password - use the correct field name from raw query
    const isPasswordValid = await bcrypt.compare(
      loginDto.password, 
      user.user_password_hash
    );
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.user_is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Update last login timestamp using the correct field name
    await this.userRepository.update(
      { user_id: user.user_id },
      { last_login: new Date() }
    );

    // Generate tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateAccessToken({
        sub: user.user_id,
        email: user.user_email,
        is_active: user.user_is_active,
        subscription_tier: user.subscription_tier,
        ai_features_included: user.ai_features_included,
        max_workouts_per_month: user.max_workouts_per_month
      }),
      this.jwtService.generateRefreshToken(user.user_id),
    ]);

    return {
      user_id: user.user_id,
      email: user.user_email,
      subscription_tier: user.subscription_tier,
      ai_features_included: user.ai_features_included,
      max_workouts_per_month: user.max_workouts_per_month,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    // Find the refresh token and check if it's valid
    const refreshTokenEntity = await this.refreshTokenRepository
      .createQueryBuilder('rt')
      .innerJoinAndSelect('rt.user', 'user')
      .where('rt.refresh_token = :token', { token: refreshTokenDto.refresh_token })
      .andWhere('rt.is_revoked = :revoked', { revoked: false })
      .andWhere('rt.expires_at > :now', { now: new Date() })
      .getOne();

    if (!refreshTokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Get current subscription status
    const userWithSubscription = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user_subscription_status', 'uss', 'uss.user_id = user.user_id')
      .select([
        'user.user_id as user_id',
        'user.email as user_email',
        'user.is_active as user_is_active',
        'uss.tier_name as subscription_tier',
        'uss.ai_features_included',
        'uss.max_workouts_per_month'
      ])
      .where('user.user_id = :userId', { userId: refreshTokenEntity.user_id })
      .getRawOne();

    if (!userWithSubscription || !userWithSubscription.user_is_active) {
      // Revoke the refresh token if user is inactive
      await this.refreshTokenRepository.update(
        { token_id: refreshTokenEntity.token_id },
        { is_revoked: true }
      );
      throw new UnauthorizedException('User is inactive');
    }

    // Generate new tokens (implement token rotation)
    const [accessToken, newRefreshToken] = await Promise.all([
      this.jwtService.generateAccessToken({
        sub: userWithSubscription.user_id,
        email: userWithSubscription.user_email,
        is_active: userWithSubscription.user_is_active,
        subscription_tier: userWithSubscription.subscription_tier,
        ai_features_included: userWithSubscription.ai_features_included,
        max_workouts_per_month: userWithSubscription.max_workouts_per_month
      }),
      this.jwtService.generateRefreshToken(userWithSubscription.user_id)
    ]);

    // Revoke the old refresh token
    await this.refreshTokenRepository.update(
      { token_id: refreshTokenEntity.token_id },
      { is_revoked: true }
    );

    return {
      user_id: userWithSubscription.user_id,
      email: userWithSubscription.user_email,
      subscription_tier: userWithSubscription.subscription_tier,
      ai_features_included: userWithSubscription.ai_features_included,
      max_workouts_per_month: userWithSubscription.max_workouts_per_month,
      access_token: accessToken,
      refresh_token: newRefreshToken
    };
  }
}
