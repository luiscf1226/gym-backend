import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesController } from './exercises.controller';
import { MuscleGroupsController } from './muscle-groups.controller';
import { ExercisesService } from './exercises.service';
import { Exercise } from './entities/exercise.entity';
import { MuscleGroup } from './entities/muscle-group.entity';
import { ExerciseMuscleGroup } from './entities/exercise-muscle-group.entity';
import { ExerciseKnowledge } from './entities/exercise-knowledge.entity';
import { ExerciseEquipment } from './entities/exercise-equipment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exercise, 
      MuscleGroup, 
      ExerciseMuscleGroup, 
      ExerciseKnowledge,
      ExerciseEquipment
    ]),
  ],
  controllers: [ExercisesController, MuscleGroupsController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {} 