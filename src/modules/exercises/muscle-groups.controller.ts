import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExercisesService } from './exercises.service';
import { MuscleGroupsResponseDto } from './dto/muscle-groups.dto';

@ApiTags('Muscle Groups')
@Controller('muscle-groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MuscleGroupsController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all muscle groups organized by body region' })
  @ApiResponse({ 
    status: 200, 
    description: 'Muscle groups retrieved successfully',
    type: MuscleGroupsResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or expired token' })
  async getMuscleGroupsByRegion(): Promise<MuscleGroupsResponseDto> {
    return this.exercisesService.getMuscleGroupsByRegion();
  }
} 