import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { SignUpResponse } from './interfaces/auth.interface';
import { JwtService } from './jwt.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      const user = this.userRepository.create({
        email,
        password_hash,
      });

      await this.userRepository.save(user);

      // Generate tokens
      const { access_token, refresh_token } = await this.jwtService.generateTokens(user);

      // Return user data with tokens
      return {
        user_id: user.user_id,
        email: user.email,
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
