import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getPublicRecipes,
  getPublicRecipe,
  rateRecipe,
  CreateRecipeData,
  UpdateRecipeData,
  ApiError,
} from '@/lib/api/recipes';

// Query keys
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (filters: string) => [...recipeKeys.lists(), { filters }] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};

// GET /api/recipes - List all recipes
export function useRecipes() {
  return useQuery({
    queryKey: recipeKeys.lists(),
    queryFn: getRecipes,
    retry: 1,
  });
}

// GET /api/public/recipes - List public recipes
export function usePublicRecipes() {
  return useQuery({
    queryKey: ['publicRecipes'],
    queryFn: getPublicRecipes,
    retry: 1,
  });
}

// GET /api/recipes/:id - Get single recipe (authenticated)
export function useRecipe(id: string) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => getRecipe(id),
    enabled: !!id && !id.startsWith('local-') && !id.startsWith('placeholder-'),
    retry: 1,
  });
}

// GET /api/public/recipes/:id - Get single public recipe (no auth required)
export function usePublicRecipe(id: string) {
  return useQuery({
    queryKey: ['publicRecipe', id],
    queryFn: () => getPublicRecipe(id),
    enabled: !!id && !id.startsWith('local-') && !id.startsWith('placeholder-'),
    retry: 1,
  });
}

// POST /api/recipes - Create recipe
export function useCreateRecipe(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipeData) => createRecipe(data),
    onSuccess: () => {
      // Invalidate all recipe queries to refetch updated lists
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['publicRecipes'] });

      // Call custom success handler if provided
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      // Call custom error handler if provided
      options?.onError?.(error);
    },
  });
}

// PUT /api/recipes/:id - Update recipe
export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecipeData }) =>
      updateRecipe(id, data),
    onSuccess: (updatedRecipe) => {
      // Update the specific recipe in cache
      queryClient.setQueryData(recipeKeys.detail(updatedRecipe.id), updatedRecipe);
      // Invalidate all recipe lists to refetch
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['publicRecipes'] });
    },
  });
}

// DELETE /api/recipes/:id - Delete recipe
export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: recipeKeys.detail(id) });
      // Invalidate all recipe lists to refresh automatically
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['publicRecipes'] });
    },
  });
}

// POST /api/recipes/:id/rate - Rate recipe
export function useRateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) =>
      rateRecipe(id, rating),
    onSuccess: (_, { id }) => {
      // Invalidate the specific recipe to refetch updated rating
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) });
      // Invalidate the list to update ratings there too
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

// Re-export ApiError for use in components
export { ApiError };
