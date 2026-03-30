import { Recipe, LoginResponse } from '@/types';

const API_BASE = '/api';

function getAuthHeader(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
}

export async function fetchPublicRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE}/public/recipes`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid response format');
  }
  return data;
}

export async function fetchUserRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE}/recipes`, {
    headers: getAuthHeader(),
  });

  if (response.status === 401) {
    throw new Error('Unauthorized');
  }
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
}

export async function createRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
  const response = await fetch(`${API_BASE}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    throw new Error('Failed to create recipe');
  }
  return response.json();
}

export async function updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
  const response = await fetch(`${API_BASE}/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    throw new Error('Failed to update recipe');
  }
  return response.json();
}

export async function deleteRecipe(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/recipes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }
}
