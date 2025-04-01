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
}
