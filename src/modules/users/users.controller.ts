import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UsersService } from './users.service';
import { UserProfileResponse } from './interfaces/profile.interface';

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
} 