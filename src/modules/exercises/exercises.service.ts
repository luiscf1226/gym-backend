import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { GetExercisesDto } from './dto/get-exercises.dto';
import { ExerciseDetailDto, MuscleGroupDto, ExerciseKnowledgeDto } from './dto/exercise-detail.dto';
import { MuscleGroupsResponseDto, MuscleGroupsByRegionDto } from './dto/muscle-groups.dto';
import { ExerciseMuscleGroup } from './entities/exercise-muscle-group.entity';
import { MuscleGroup } from './entities/muscle-group.entity';
import { ExerciseKnowledge } from './entities/exercise-knowledge.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(ExerciseMuscleGroup)
    private readonly exerciseMuscleGroupRepository: Repository<ExerciseMuscleGroup>,
    @InjectRepository(MuscleGroup)
    private readonly muscleGroupRepository: Repository<MuscleGroup>,
    @InjectRepository(ExerciseKnowledge)
    private readonly exerciseKnowledgeRepository: Repository<ExerciseKnowledge>,
  ) {}

  async getExercises(filters: GetExercisesDto): Promise<Exercise[]> {
    const queryBuilder = this.exerciseRepository.createQueryBuilder('exercise');

    if (filters.difficulty) {
      queryBuilder.andWhere('exercise.difficulty = :difficulty', {
        difficulty: filters.difficulty,
      });
    }

    return queryBuilder.getMany();
  }

  async getExerciseById(exerciseId: string): Promise<ExerciseDetailDto> {
    // Get the exercise
    const exercise = await this.exerciseRepository.findOne({
      where: { exercise_id: exerciseId }
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
    }

    // Get the muscle groups for this exercise
    const exerciseMuscleGroups = await this.exerciseMuscleGroupRepository.find({
      where: { exercise_id: exerciseId },
      relations: ['muscle_group']
    });

    // Transform muscle groups data
    const muscleGroups: MuscleGroupDto[] = exerciseMuscleGroups.map(emg => ({
      muscle_group_id: emg.muscle_group.muscle_group_id,
      name: emg.muscle_group.name,
      description: emg.muscle_group.description,
      body_region: emg.muscle_group.body_region,
      is_primary: emg.is_primary
    }));

    // Get the knowledge for this exercise
    const knowledge = await this.exerciseKnowledgeRepository.findOne({
      where: { exercise_id: exerciseId }
    });

    // Transform knowledge data
    const knowledgeDto: ExerciseKnowledgeDto | undefined = knowledge ? {
      content: knowledge.content,
      source: knowledge.source
    } : undefined;

    // Return the complete exercise detail
    return {
      exercise_id: exercise.exercise_id,
      name: exercise.name,
      description: exercise.description,
      instructions: exercise.instructions,
      difficulty: exercise.difficulty,
      is_standard: exercise.is_standard,
      created_by_user_id: exercise.created_by_user_id,
      video_url: exercise.video_url,
      image_url: exercise.image_url,
      muscle_groups: muscleGroups,
      knowledge: knowledgeDto
    };
  }

  async getExercisesByMuscleGroup(muscleGroupId: string): Promise<ExerciseDetailDto[]> {
    // First, verify that the muscle group exists
    const muscleGroup = await this.muscleGroupRepository.findOne({
      where: { muscle_group_id: muscleGroupId }
    });

    if (!muscleGroup) {
      throw new NotFoundException(`Muscle group with ID ${muscleGroupId} not found`);
    }

    // Get all exercise-muscle group relationships for this muscle group
    const exerciseMuscleGroups = await this.exerciseMuscleGroupRepository.find({
      where: { muscle_group_id: muscleGroupId },
      relations: ['exercise', 'muscle_group']
    });

    // Get all unique exercise IDs
    const exerciseIds = [...new Set(exerciseMuscleGroups.map(emg => emg.exercise_id))];

    // Get all exercises with their muscle groups and knowledge
    const exercises = await this.exerciseRepository.find({
      where: { exercise_id: In(exerciseIds) }
    });

    // Get all muscle groups for these exercises
    const allExerciseMuscleGroups = await this.exerciseMuscleGroupRepository.find({
      where: { exercise_id: In(exerciseIds) },
      relations: ['muscle_group']
    });

    // Get all knowledge for these exercises
    const allKnowledge = await this.exerciseKnowledgeRepository.find({
      where: { exercise_id: In(exerciseIds) }
    });

    // Map exercises to their detailed DTOs
    return exercises.map(exercise => {
      // Get muscle groups for this exercise
      const exerciseMuscleGroupsForExercise = allExerciseMuscleGroups.filter(
        emg => emg.exercise_id === exercise.exercise_id
      );

      // Transform muscle groups data
      const muscleGroups: MuscleGroupDto[] = exerciseMuscleGroupsForExercise.map(emg => ({
        muscle_group_id: emg.muscle_group.muscle_group_id,
        name: emg.muscle_group.name,
        description: emg.muscle_group.description,
        body_region: emg.muscle_group.body_region,
        is_primary: emg.is_primary
      }));

      // Get knowledge for this exercise
      const knowledge = allKnowledge.find(k => k.exercise_id === exercise.exercise_id);

      // Transform knowledge data
      const knowledgeDto: ExerciseKnowledgeDto | undefined = knowledge ? {
        content: knowledge.content,
        source: knowledge.source
      } : undefined;

      // Return the complete exercise detail
      return {
        exercise_id: exercise.exercise_id,
        name: exercise.name,
        description: exercise.description,
        instructions: exercise.instructions,
        difficulty: exercise.difficulty,
        is_standard: exercise.is_standard,
        created_by_user_id: exercise.created_by_user_id,
        video_url: exercise.video_url,
        image_url: exercise.image_url,
        muscle_groups: muscleGroups,
        knowledge: knowledgeDto
      };
    });
  }

  async getMuscleGroupsByRegion(): Promise<MuscleGroupsResponseDto> {
    // Get all muscle groups
    const muscleGroups = await this.muscleGroupRepository.find({
      order: {
        body_region: 'ASC',
        name: 'ASC'
      }
    });

    // Group muscle groups by body region
    const muscleGroupsByRegion = muscleGroups.reduce((acc, muscleGroup) => {
      const region = muscleGroup.body_region;
      
      if (!acc[region]) {
        acc[region] = [];
      }
      
      acc[region].push({
        muscle_group_id: muscleGroup.muscle_group_id,
        name: muscleGroup.name,
        description: muscleGroup.description,
        body_region: muscleGroup.body_region
      });
      
      return acc;
    }, {} as Record<string, any[]>);

    // Transform to the response format
    const regions: MuscleGroupsByRegionDto[] = Object.entries(muscleGroupsByRegion).map(([region, muscleGroups]) => ({
      region,
      muscle_groups: muscleGroups
    }));

    return { regions };
  }
} 