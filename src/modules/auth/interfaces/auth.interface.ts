export interface SignUpResponse {
  user_id: string;
  email: string;
  access_token: string;
  refresh_token: string;
}

export interface TokenPayload {
  sub: string;  // user_id
  email: string;
  is_active: boolean;
}

export interface RefreshTokenPayload {
  user_id: string;
  token_id: string;
} 