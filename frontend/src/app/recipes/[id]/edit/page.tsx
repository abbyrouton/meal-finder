'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { LoadingSpinner, ChefHat } from '@/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { usePublicRecipe, useUpdateRecipe } from '@/lib/hooks/useRecipes';
import { getPlaceholderRecipe } from '@/lib/placeholder-data';
import { getLocalRecipe, updateLocalRecipe } from '@/lib/local-recipes';

const recipeFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Recipe title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  cuisine_type: z.string().max(50, 'Cuisine type must be less than 50 characters').optional(),
  prep_time: z
    .string()
    .optional()
    .refine((val) => !val || (parseInt(val) >= 1 && parseInt(val) <= 1440), {
      message: 'Prep time must be between 1 and 1440 minutes',
    }),
  ingredients: z.string().max(5000, 'Ingredients must be less than 5000 characters').optional(),
  steps: z.string().max(10000, 'Instructions must be less than 10000 characters').optional(),
  notes: z.string().max(2000, 'Notes must be less than 2000 characters').optional(),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;

  const [error, setError] = useState<string | null>(null);
  const [isLocalRecipe, setIsLocalRecipe] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(false);
  const [localDataLoaded, setLocalDataLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Check authentication status and get current user
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      } catch {
        setCurrentUserId(null);
      }
    }
  }, []);

  // Fetch recipe from public API (any recipe can be loaded for editing UI)
  const {
    data: apiRecipe,
    isLoading: isLoadingApi,
    isError: isApiError,
  } = usePublicRecipe(recipeId);

  // Update mutation hook
  const updateRecipeMutation = useUpdateRecipe();

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: '',
      description: '',
      cuisine_type: '',
      prep_time: '',
      ingredients: '',
      steps: '',
      notes: '',
    },
  });

  // Load local or placeholder recipe data
  useEffect(() => {
    if (localDataLoaded) return;

    if (recipeId.startsWith('local-')) {
      const localRecipe = getLocalRecipe(recipeId);
      if (localRecipe) {
        form.reset({
          title: localRecipe.title,
          description: localRecipe.description || '',
          cuisine_type: localRecipe.cuisine_type || '',
          prep_time: localRecipe.prep_time?.toString() || '',
          ingredients: localRecipe.ingredients || '',
          steps: localRecipe.steps || '',
          notes: localRecipe.notes || '',
        });
        setIsLocalRecipe(true);
      } else {
        setError('Recipe not found');
      }
      setLocalDataLoaded(true);
    } else if (recipeId.startsWith('placeholder-')) {
      const placeholderRecipe = getPlaceholderRecipe(recipeId);
      if (placeholderRecipe) {
        form.reset({
          title: placeholderRecipe.title,
          description: placeholderRecipe.description || '',
          cuisine_type: placeholderRecipe.cuisine_type || '',
          prep_time: placeholderRecipe.prep_time?.toString() || '',
          ingredients: placeholderRecipe.ingredients || '',
          steps: placeholderRecipe.steps || '',
          notes: placeholderRecipe.notes || '',
        });
        setIsPlaceholder(true);
      } else {
        setError('Recipe not found');
      }
      setLocalDataLoaded(true);
    }
  }, [recipeId, form, localDataLoaded]);

  // Load API recipe data into form when it arrives
  useEffect(() => {
    if (apiRecipe && !isLocalRecipe && !isPlaceholder) {
      form.reset({
        title: apiRecipe.title,
        description: apiRecipe.description || '',
        cuisine_type: apiRecipe.cuisine_type || '',
        prep_time: apiRecipe.prep_time?.toString() || '',
        ingredients: apiRecipe.ingredients || '',
        steps: apiRecipe.steps || '',
        notes: apiRecipe.notes || '',
      });
    }
  }, [apiRecipe, form, isLocalRecipe, isPlaceholder]);

  const onSubmit = async (data: RecipeFormValues) => {
    setError(null);
    const prepTimeNum = data.prep_time ? parseInt(data.prep_time, 10) : null;

    const recipeData = {
      title: data.title,
      description: data.description || null,
      cuisine_type: data.cuisine_type || null,
      prep_time: prepTimeNum,
      ingredients: data.ingredients || null,
      steps: data.steps || null,
      notes: data.notes || null,
    };

    // Handle local recipe update
    if (isLocalRecipe) {
      updateLocalRecipe(recipeId, {
        title: data.title,
        description: data.description || undefined,
        cuisine_type: data.cuisine_type || undefined,
        prep_time: prepTimeNum || undefined,
        ingredients: data.ingredients || '',
        steps: data.steps || '',
        notes: data.notes || '',
      });
      router.push('/recipes');
      return;
    }

    // Handle placeholder - can't actually edit
    if (isPlaceholder) {
      router.push('/recipes');
      return;
    }

    // Handle API recipe update with mutation
    updateRecipeMutation.mutate(
      { id: recipeId, data: recipeData },
      {
        onSuccess: () => {
          router.push('/recipes');
        },
        onError: (err) => {
          setError(err.message || 'Failed to update recipe');
        },
      }
    );
  };

  // Loading state
  const isLoading = isLoadingApi && !isLocalRecipe && !isPlaceholder && !localDataLoaded;

  // Show auth required message if not logged in
  if (isLoggedIn === false) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-black text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight">Edit Recipe</h1>
          </div>
        </div>
        <div className="h-12 checkerboard-lg" />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ChefHat size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in required</h2>
            <p className="text-gray-500 mb-6">You must be signed in to edit or delete recipes.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Still checking auth status
  if (isLoggedIn === null || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-black text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight">Edit Recipe</h1>
            <p className="text-gray-300 mt-2">Update your culinary creation</p>
          </div>
        </div>
        <div className="h-12 checkerboard-lg" />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <LoadingSpinner message="Loading recipe..." />
        </main>
      </div>
    );
  }

  // Check ownership for API recipes (local recipes are always owned by current user)
  const isOwner = isLocalRecipe || (apiRecipe && currentUserId && apiRecipe.user_id === currentUserId);

  // Show permission denied message if user doesn't own this recipe
  if (apiRecipe && !isLocalRecipe && !isPlaceholder && !isOwner) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-black text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight">Edit Recipe</h1>
          </div>
        </div>
        <div className="h-12 checkerboard-lg" />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ChefHat size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Permission denied</h2>
            <p className="text-gray-500 mb-6">You can only edit your own recipes.</p>
            <Link
              href={`/recipes/${recipeId}`}
              className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              View Recipe
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Error state for API recipes
  if (isApiError && !isLocalRecipe && !isPlaceholder) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-black text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight">Edit Recipe</h1>
            <p className="text-gray-300 mt-2">Update your culinary creation</p>
          </div>
        </div>
        <div className="h-12 checkerboard-lg" />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ChefHat size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Recipe not found</h2>
            <p className="text-gray-500 mb-6">We couldn't load this recipe.</p>
            <Link
              href="/recipes"
              className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Back to Recipes
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isSubmitting = form.formState.isSubmitting || updateRecipeMutation.isPending;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight">Edit Recipe</h1>
          <p className="text-gray-300 mt-2">Update your culinary creation</p>
        </div>
      </div>

      {/* Checkerboard divider */}
      <div className="h-12 checkerboard-lg" />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">

        {isPlaceholder && (
          <div className="mb-6 p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-600 text-sm">
            This is a sample recipe and cannot be edited. Add your own recipe instead!
          </div>
        )}

        {isLocalRecipe && (
          <div className="mb-6 p-3 bg-green-50 border-2 border-green-200 rounded-lg text-center text-green-700 text-sm">
            <ChefHat size={18} className="inline mr-2" />
            Editing your locally saved recipe.
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-6">
            {/* Error message display */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Error updating recipe</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Recipe Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Grandma's Chicken Soup"
                      disabled={isPlaceholder}
                      className="h-10 border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20 disabled:bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of this recipe"
                      disabled={isPlaceholder}
                      className="min-h-[80px] border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20 disabled:bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional. What makes this recipe special?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cuisine_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Cuisine Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Italian, Mexican"
                        disabled={isPlaceholder}
                        className="h-10 border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20 disabled:bg-gray-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prep_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Prep Time (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        min="1"
                        disabled={isPlaceholder}
                        className="h-10 border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20 disabled:bg-gray-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Ingredients</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List each ingredient on a new line"
                      disabled={isPlaceholder}
                      className="min-h-[150px] border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20 disabled:bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter each ingredient on a new line
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Step-by-step cooking instructions"
                      disabled={isPlaceholder}
                      className="min-h-[200px] border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20 disabled:bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write clear, numbered steps
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tips, variations, or personal notes"
                      disabled={isPlaceholder}
                      className="min-h-[80px] border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20 disabled:bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional. Any tips or modifications to remember
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              {!isPlaceholder && (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              )}
              <Link
                href="/recipes"
                className={`inline-flex items-center justify-center h-12 px-6 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition ${isPlaceholder ? 'flex-1' : ''}`}
              >
                {isPlaceholder ? 'Back to Recipes' : 'Cancel'}
              </Link>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
