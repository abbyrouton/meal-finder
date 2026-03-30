import { RecipeDetail } from './placeholder-data';

const STORAGE_KEY = 'meal-finder-recipes';

export function getLocalRecipes(): RecipeDetail[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveLocalRecipe(recipe: Omit<RecipeDetail, 'id' | 'user_id' | 'user_name' | 'avg_rating' | 'created_at'>): RecipeDetail {
  const recipes = getLocalRecipes();

  const newRecipe: RecipeDetail = {
    ...recipe,
    id: `local-${Date.now()}`,
    user_id: 'local-user',
    user_name: 'You',
    avg_rating: 0,
    created_at: new Date().toISOString(),
  };

  recipes.unshift(newRecipe);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));

  return newRecipe;
}

export function updateLocalRecipe(id: string, updates: Partial<RecipeDetail>): RecipeDetail | null {
  const recipes = getLocalRecipes();
  const index = recipes.findIndex(r => r.id === id);

  if (index === -1) return null;

  recipes[index] = { ...recipes[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));

  return recipes[index];
}

export function deleteLocalRecipe(id: string): boolean {
  const recipes = getLocalRecipes();
  const filtered = recipes.filter(r => r.id !== id);

  if (filtered.length === recipes.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function getLocalRecipe(id: string): RecipeDetail | undefined {
  const recipes = getLocalRecipes();
  return recipes.find(r => r.id === id);
}
