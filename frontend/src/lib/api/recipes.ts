import { Recipe, RecipeDetail } from '@/types';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper to get auth header
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Helper to handle response
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || errorData.message || `Request failed`,
      response.status,
      response.statusText
    );
  }
  return response.json();
}

// GET /api/recipes - List all recipes
export async function getRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE}/recipes`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<Recipe[]>(response);
}

// GET /api/recipes/:id - Get single recipe
export async function getRecipe(id: string): Promise<RecipeDetail> {
  const response = await fetch(`${API_BASE}/recipes/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<RecipeDetail>(response);
}

// POST /api/recipes - Create new recipe
export interface CreateRecipeData {
  title: string;
  description?: string | null;
  cuisine_type?: string | null;
  prep_time?: number | null;
  ingredients?: string | null;
  steps?: string | null;
  notes?: string | null;
}

export async function createRecipe(data: CreateRecipeData): Promise<RecipeDetail> {
  const response = await fetch(`${API_BASE}/recipes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<RecipeDetail>(response);
}

// PUT /api/recipes/:id - Update recipe
export interface UpdateRecipeData {
  title?: string;
  description?: string | null;
  cuisine_type?: string | null;
  prep_time?: number | null;
  ingredients?: string | null;
  steps?: string | null;
  notes?: string | null;
}

export async function updateRecipe(id: string, data: UpdateRecipeData): Promise<RecipeDetail> {
  const response = await fetch(`${API_BASE}/recipes/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<RecipeDetail>(response);
}

// DELETE /api/recipes/:id - Delete recipe
export async function deleteRecipe(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/recipes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || errorData.message || 'Failed to delete recipe',
      response.status,
      response.statusText
    );
  }
}

// GET /api/public/recipes - List all public recipes (no auth required)
export async function getPublicRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE}/public/recipes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<Recipe[]>(response);
}

// GET /api/public/recipes/:id - Get single public recipe (no auth required)
export async function getPublicRecipe(id: string): Promise<RecipeDetail> {
  const response = await fetch(`${API_BASE}/public/recipes/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<RecipeDetail>(response);
}

// POST /api/recipes/:id/rate - Rate a recipe
export async function rateRecipe(id: string, rating: number): Promise<void> {
  const response = await fetch(`${API_BASE}/recipes/${id}/rate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || errorData.message || 'Failed to rate recipe',
      response.status,
      response.statusText
    );
  }
}
