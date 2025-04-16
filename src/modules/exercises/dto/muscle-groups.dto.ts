import { ApiProperty } from '@nestjs/swagger';

export class MuscleGroupDto {
  @ApiProperty({ description: 'Unique identifier of the muscle group' })
  muscle_group_id: string;

  @ApiProperty({ description: 'Name of the muscle group' })
  name: string;

  @ApiProperty({ description: 'Description of the muscle group' })
  description: string;

  @ApiProperty({ description: 'Body region of the muscle group' })
  body_region: string;
}

export class MuscleGroupsByRegionDto {
  @ApiProperty({ description: 'Body region name', example: 'upper' })
  region: string;

  @ApiProperty({ description: 'Muscle groups in this region', type: [MuscleGroupDto] })
  muscle_groups: MuscleGroupDto[];
}

export class MuscleGroupsResponseDto {
  @ApiProperty({ description: 'Muscle groups organized by body region', type: [MuscleGroupsByRegionDto] })
  regions: MuscleGroupsByRegionDto[];
} 