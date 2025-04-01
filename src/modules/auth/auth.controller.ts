import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Throttle, SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute for signup
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: SignUpDto,
    examples: {
      validUser: {
        summary: 'Valid User Registration',
        value: {
          email: "user@example.com",
          password: "StrongP@ssw0rd"
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created',
    schema: {
      example: {
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        email: "user@example.com",
        access_token: "eyJhbGciOiJIUzI1...",
        refresh_token: "abc123..."
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 429, description: 'Too Many Requests - Rate limit exceeded' })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute for login
  @ApiOperation({ summary: 'Authenticate user and get tokens' })
  @ApiBody({
    type: LoginDto,
    examples: {
      validLogin: {
        summary: 'Valid Login Credentials',
        value: {
          email: "user@example.com",
          password: "StrongP@ssw0rd"
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully authenticated',
    schema: {
      example: {
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        email: "user@example.com",
        subscription_status: "active",
        access_token: "eyJhbGciOiJIUzI1...",
        refresh_token: "abc123..."
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 429, description: 'Too Many Requests - Rate limit exceeded' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}