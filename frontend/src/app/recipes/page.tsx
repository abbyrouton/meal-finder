'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { RecipeCard, LoadingSpinner, ChefHat, EmptyState } from '@/components';
import { usePublicRecipes } from '@/lib/hooks/useRecipes';
import { getLocalRecipes } from '@/lib/local-recipes';

export default function RecipesPage() {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  // Fetch recipes from API using TanStack Query
  const {
    data: apiRecipes,
    isLoading,
    isError,
    refetch
  } = usePublicRecipes();

  // Combine API recipes with local recipes
  const recipes = useMemo(() => {
    const localRecipes = getLocalRecipes();
    const serverRecipes = apiRecipes || [];
    return [...localRecipes, ...serverRecipes];
  }, [apiRecipes]);

  // Get unique cuisine types
  const cuisineTypes = useMemo(() => {
    const cuisines = recipes
      .map(r => r.cuisine_type)
      .filter((c): c is string => c !== null && c !== undefined && c.trim() !== '');
    return [...new Set(cuisines)].sort();
  }, [recipes]);

  // Filter recipes by selected cuisine
  const filteredRecipes = useMemo(() => {
    if (selectedCuisine === 'all') return recipes;
    return recipes.filter(r => r.cuisine_type === selectedCuisine);
  }, [recipes, selectedCuisine]);

  const localCount = recipes.filter(r => r.id.startsWith('local-')).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-2 checkerboard" />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <ChefHat size={28} className="text-red-600" />
            All Recipes
          </h1>
          <LoadingSpinner message="Loading recipes from server..." />
        </main>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-2 checkerboard" />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <ChefHat size={28} className="text-red-600" />
            All Recipes
          </h1>
          <div className="text-center py-8 bg-orange-50 border-2 border-orange-200 rounded-xl mb-6">
            <ChefHat size={48} className="text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Kitchen's temporarily closed</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              We couldn't load recipes from the server. Don't worry, your local recipes are still here!
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>

          {/* Still show local recipes if any */}
          {localCount > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ChefHat size={24} className="text-green-600" />
                Your Local Recipes ({localCount})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.filter(r => r.id.startsWith('local-')).map((recipe) => (
                  <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                    <RecipeCard recipe={recipe} showRating showAuthor />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-white">
      {/* Checkerboard accent */}
      <div className="h-2 checkerboard" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <ChefHat size={28} className="text-red-600" />
            All Recipes
          </h1>
          <span className="text-gray-500">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
            {selectedCuisine !== 'all' && ` in ${selectedCuisine}`}
          </span>
        </div>

        {/* Cuisine Filter */}
        {cuisineTypes.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Filter by cuisine:</span>
              <button
                onClick={() => setSelectedCuisine('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCuisine === 'all'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCuisine === cuisine
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Local recipes indicator */}
        {localCount > 0 && selectedCuisine === 'all' && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-700">
            <ChefHat size={20} className="inline mr-2" />
            You have {localCount} recipe{localCount > 1 ? 's' : ''} saved locally!
          </div>
        )}

        {/* Empty state */}
        {filteredRecipes.length === 0 ? (
          selectedCuisine !== 'all' ? (
            <EmptyState
              icon="search"
              title={`No ${selectedCuisine} recipes yet`}
              description={`We couldn't find any ${selectedCuisine} recipes. Try a different cuisine or add your own!`}
              actionLabel="Show All Recipes"
              onAction={() => setSelectedCuisine('all')}
              secondaryActionLabel="Add Recipe"
              secondaryActionHref="/recipes/new"
            />
          ) : (
            <EmptyState
              icon="chef"
              title="Your recipe collection awaits!"
              description="Start building your personal cookbook. Save your favorite recipes, rate them, and never forget a delicious meal again."
              actionLabel="Add Your First Recipe"
              actionHref="/recipes/new"
              secondaryActionLabel="Browse Top Recipes"
              secondaryActionHref="/top-recipes"
            />
          )
        ) : (
          /* Recipe grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <RecipeCard recipe={recipe} showRating showAuthor />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
