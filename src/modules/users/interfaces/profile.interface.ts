export interface UserProfileResponse {
  // Basic user info
  user_id: string;
  email: string;
  is_active: boolean;
  
  // Subscription info
  subscription_tier: string;
  ai_features_included: boolean;
  max_workouts_per_month: number | null;
  
  // Profile info
  first_name: string | null;
  last_name: string | null;
  date_of_birth: Date | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  fitness_level: string | null;
  fitness_goals: string | null;
  preferences: Record<string, any> | null;
  
  // Profile metadata
  profile_created_at: Date | null;
  profile_updated_at: Date | null;
  
  // Account metadata
  account_created_at: Date;
  last_login: Date | null;
} 