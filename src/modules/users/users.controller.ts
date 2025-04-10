import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UsersService } from './users.service';
import { UserProfileResponse } from './interfaces/profile.interface';
import { SetupBasicProfileDto } from './dto/setup-basic-profile.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile information' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully',
    type: 'object',
    schema: {
      example: {
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        email: "user@example.com",
        is_active: true,
        subscription_tier: "pro",
        ai_features_included: true,
        max_workouts_per_month: null,
        first_name: "John",
        last_name: "Doe",
        fitness_level: "intermediate",
        fitness_goals: "Build muscle and improve endurance"
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or expired token' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@GetUser('user_id') userId: string): Promise<UserProfileResponse> {
    return this.usersService.getUserProfile(userId);
  }

  @Post('profile/setup/basic')
  @ApiOperation({ summary: 'Setup or update basic user profile information' })
  @ApiResponse({ 
    status: 201, 
    description: 'Profile setup completed successfully',
    type: 'object',
    schema: {
      example: {
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        first_name: "John",
        last_name: "Doe",
        date_of_birth: "1990-01-01",
        gender: "male",
        height: 180,
        weight: 75,
        created_at: "2024-04-01T00:00:00.000Z",
        updated_at: "2024-04-01T00:00:00.000Z"
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or expired token' })
  async setupBasicProfile(
    @GetUser('user_id') userId: string,
    @Body() profileData: SetupBasicProfileDto
  ) {
    return this.usersService.setupBasicProfile(userId, profileData);
  }
} 