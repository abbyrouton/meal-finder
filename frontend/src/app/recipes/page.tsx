'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Recipe } from '@/types';
import { RecipeCard, LoadingSpinner, ChefHat } from '@/components';
import { fetchPublicRecipes } from '@/lib/api';
import { placeholderRecipes } from '@/lib/placeholder-data';
import { getLocalRecipes } from '@/lib/local-recipes';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const data = await fetchPublicRecipes();
      if (data.length > 0) {
        const localRecipes = getLocalRecipes();
        setRecipes([...localRecipes, ...data]);
      } else {
        const localRecipes = getLocalRecipes();
        setRecipes([...localRecipes, ...placeholderRecipes]);
      }
    } catch {
      const localRecipes = getLocalRecipes();
      setRecipes([...localRecipes, ...placeholderRecipes]);
    } finally {
      setLoading(false);
    }
  };

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

        {localCount > 0 && selectedCuisine === 'all' && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-700">
            <ChefHat size={20} className="inline mr-2" />
            You have {localCount} recipe{localCount > 1 ? 's' : ''} saved locally!
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Loading recipes..." />
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
            <ChefHat size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No recipes found for "{selectedCuisine}"</p>
            <button
              onClick={() => setSelectedCuisine('all')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Show All Recipes
            </button>
          </div>
        ) : (
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
