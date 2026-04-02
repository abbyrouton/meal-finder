'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { ChefHat } from '@/components';
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
import { useCreateRecipe } from '@/lib/hooks/useRecipes';
import { saveLocalRecipe } from '@/lib/local-recipes';

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

export default function NewRecipePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // TanStack Query mutation hook
  const createRecipeMutation = useCreateRecipe({
    onSuccess: () => {
      // Redirect to recipes list on success
      router.push('/recipes');
    },
    onError: (err) => {
      // Show error message
      setError(err.message || 'Failed to save recipe. Please try again.');
    },
  });

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

  const onSubmit = async (data: RecipeFormValues) => {
    setError(null);
    const token = localStorage.getItem('token');
    const prepTimeNum = data.prep_time ? parseInt(data.prep_time, 10) : null;

    if (token) {
      // User is logged in - use mutation to POST to API
      createRecipeMutation.mutate({
        title: data.title,
        description: data.description || null,
        cuisine_type: data.cuisine_type || null,
        prep_time: prepTimeNum,
        ingredients: data.ingredients || null,
        steps: data.steps || null,
        notes: data.notes || null,
      });
    } else {
      // User not logged in - save locally
      try {
        const newRecipe = saveLocalRecipe({
          title: data.title,
          description: data.description || null,
          cuisine_type: data.cuisine_type || null,
          prep_time: prepTimeNum,
          ingredients: data.ingredients || '',
          steps: data.steps || '',
          notes: data.notes || '',
        });
        router.push(`/recipes/${newRecipe.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save recipe locally');
      }
    }
  };

  const isSubmitting = form.formState.isSubmitting || createRecipeMutation.isPending;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight">Add New Recipe</h1>
          <p className="text-gray-300 mt-2">Share your culinary creation</p>
        </div>
      </div>

      {/* Checkerboard divider */}
      <div className="h-12 checkerboard-lg" />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-6">
            {/* Error message display */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Error saving recipe</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {form.formState.errors.root && (
              <div className="p-3 bg-red-50 border-2 border-red-500 text-red-700 rounded-lg text-sm">
                {form.formState.errors.root.message}
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
                      className="h-10 border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20"
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
                      className="min-h-[80px] border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20"
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
                        className="h-10 border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20"
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
                        className="h-10 border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20"
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
                      placeholder="List each ingredient on a new line&#10;&#10;Example:&#10;2 cups flour&#10;1 tsp salt&#10;3 eggs"
                      className="min-h-[150px] border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20"
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
                      placeholder="Step-by-step cooking instructions&#10;&#10;Example:&#10;1. Preheat oven to 350°F&#10;2. Mix dry ingredients&#10;3. Add wet ingredients"
                      className="min-h-[200px] border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20"
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
                      className="min-h-[80px] border-2 border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500/20"
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
                  'Save Recipe'
                )}
              </Button>
              <Link
                href="/recipes"
                className="inline-flex items-center justify-center h-12 px-6 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
