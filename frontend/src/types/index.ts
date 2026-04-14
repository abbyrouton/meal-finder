export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  cuisine_type: string | null;
  prep_time: number | null;
  user_name?: string | null;
  avg_rating?: number;
}

export interface RecipeDetail extends Recipe {
  ingredients: string;
  steps: string;
  notes: string;
  user_id: string;
  created_at: string;
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

export interface UserRating {
  id: string;
  user_id: string;
  recipe_id: string;
  score: number;
  notes: string | null;
  created_at: string;
  recipe_title: string;
  recipe_cuisine_type: string | null;
  recipe_prep_time: number | null;
}
