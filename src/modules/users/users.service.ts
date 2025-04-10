import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserProfileResponse } from './interfaces/profile.interface';
import { SetupBasicProfileDto } from './dto/setup-basic-profile.dto';
import { SetupFitnessProfileDto } from './dto/setup-fitness-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    // Get user with subscription status and account info
    const userWithSubscription = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user_subscription_status', 'uss', 'uss.user_id = user.user_id')
      .select([
        'user.user_id',
        'user.email',
        'user.is_active',
        'user.created_at',
        'user.last_login',
        'uss.tier_name as subscription_tier',
        'uss.ai_features_included',
        'uss.max_workouts_per_month'
      ])
      .where('user.user_id = :userId', { userId })
      .getRawOne();

    if (!userWithSubscription) {
      throw new NotFoundException('User not found');
    }

    // Get user profile if it exists
    const profile = await this.userProfileRepository.findOne({
      where: { user_id: userId }
    });

    // Combine user data with profile data
    return {
      // Basic user info
      user_id: userWithSubscription.user_id,
      email: userWithSubscription.email,
      is_active: userWithSubscription.is_active,
      
      // Subscription info
      subscription_tier: userWithSubscription.subscription_tier || 'basic',
      ai_features_included: userWithSubscription.ai_features_included || false,
      max_workouts_per_month: userWithSubscription.max_workouts_per_month,
      
      // Profile info
      first_name: profile?.first_name || null,
      last_name: profile?.last_name || null,
      date_of_birth: profile?.date_of_birth || null,
      gender: profile?.gender || null,
      height: profile?.height || null,
      weight: profile?.weight || null,
      fitness_level: profile?.fitness_level || null,
      primary_goal: profile?.primary_goal || null,
      preferences: profile?.preferences || null,
      setup_completed: profile?.setup_completed || false,
      preferred_workout_duration: profile?.preferred_workout_duration || null,
      workout_frequency: profile?.workout_frequency || null,
      
      // Profile metadata
      profile_created_at: profile?.created_at || null,
      profile_updated_at: profile?.updated_at || null,
      
      // Account metadata
      account_created_at: userWithSubscription.created_at,
      last_login: userWithSubscription.last_login,
    };
  }

  async setupBasicProfile(userId: string, profileData: SetupBasicProfileDto): Promise<UserProfile> {
    let profile = await this.userProfileRepository.findOne({
      where: { user_id: userId }
    });

    if (profile) {
      // Update existing profile
      Object.assign(profile, {
        ...profileData,
        setup_completed: true,
        updated_at: new Date()
      });
    } else {
      // Create new profile
      profile = this.userProfileRepository.create({
        user_id: userId,
        ...profileData,
        setup_completed: true
      });
    }

    return this.userProfileRepository.save(profile);
  }

  async setupFitnessProfile(userId: string, fitnessData: SetupFitnessProfileDto): Promise<UserProfile> {
    let profile = await this.userProfileRepository.findOne({
      where: { user_id: userId }
    });

    if (!profile) {
      throw new NotFoundException('User profile not found. Please complete basic profile setup first.');
    }

    // Update profile with fitness data
    Object.assign(profile, {
      ...fitnessData,
      setup_completed: true,
      updated_at: new Date()
    });

    return this.userProfileRepository.save(profile);
  }
} 