import { Controller, Get, Query, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExercisesService } from './exercises.service';
import { GetExercisesDto } from './dto/get-exercises.dto';
import { Exercise } from './entities/exercise.entity';
import { ExerciseDetailDto } from './dto/exercise-detail.dto';

@ApiTags('Exercises')
@Controller('exercises')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of exercises with optional filtering' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of exercises retrieved successfully',
    type: [Exercise]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or expired token' })
  async getExercises(@Query() filters: GetExercisesDto): Promise<Exercise[]> {
    return this.exercisesService.getExercises(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed information about a specific exercise' })
  @ApiParam({ name: 'id', description: 'Exercise ID', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Exercise details retrieved successfully',
    type: ExerciseDetailDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or expired token' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  async getExerciseById(@Param('id', ParseUUIDPipe) id: string): Promise<ExerciseDetailDto> {
    return this.exercisesService.getExerciseById(id);
  }

  @Get('by-muscle/:muscleGroupId')
  @ApiOperation({ summary: 'Get exercises targeting a specific muscle group' })
  @ApiParam({ name: 'muscleGroupId', description: 'Muscle Group ID', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of exercises targeting the specified muscle group',
    type: [ExerciseDetailDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or expired token' })
  @ApiResponse({ status: 404, description: 'Muscle group not found' })
  async getExercisesByMuscleGroup(
    @Param('muscleGroupId', ParseUUIDPipe) muscleGroupId: string
  ): Promise<ExerciseDetailDto[]> {
    return this.exercisesService.getExercisesByMuscleGroup(muscleGroupId);
  }
} 