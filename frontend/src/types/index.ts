export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  cuisine_type: string | null;
  prep_time: number | null;
  user_name?: string | null;
  avg_rating?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
