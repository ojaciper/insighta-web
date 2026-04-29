export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  role: 'admin' | 'analyst';
  is_active: boolean;
  created_at?: string;
}

export interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: string;
}

export interface ProfileListResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  data: Profile[];
}

export interface SearchResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  query_interpreted: Record<string, any>;
  data: Profile[];
}

export interface DemographicsStats {
  status: string;
  total_profiles: number;
  gender_distribution: Record<string, number>;
  age_group_distribution: Record<string, number>;
  top_countries: Array<{ country_id: string; count: number }>;
}

export interface AuthResponse {
  status: string;
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface Filters {
  gender?: string;
  age_group?: string;
  country_id?: string;
  min_age?: number;
  max_age?: number;
  sort_by?: string;
  order?: string;
  page?: number;
  limit?: number;
}