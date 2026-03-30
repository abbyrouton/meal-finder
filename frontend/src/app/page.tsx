'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recipe } from '@/types';
import { RecipeCard, LoadingSpinner, ChefHat } from '@/components';
import { fetchPublicRecipes } from '@/lib/api';
import { placeholderRecipes } from '@/lib/placeholder-data';
import { getLocalRecipes } from '@/lib/local-recipes';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

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

  const localCount = recipes.filter(r => r.id.startsWith('local-')).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 checkerboard-dark opacity-30" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <ChefHat size={64} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Discover Delicious Recipes</h1>
          <p className="text-xl text-gray-300 mb-8">
            Browse community recipes, ratings, and find your next favorite meal
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/recipes"
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Browse Recipes
            </Link>
            <Link
              href="/recipes/new"
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition"
            >
              Add Recipe
            </Link>
          </div>
        </div>
      </div>

      {/* Checkerboard divider */}
      <div className="h-4 checkerboard" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <ChefHat size={28} className="text-red-600" />
            {localCount > 0 ? 'Your Recipes & More' : 'Featured Recipes'}
          </h2>
          <Link href="/recipes" className="text-red-600 hover:text-red-700 font-medium">
            View all &rarr;
          </Link>
        </div>

        {localCount > 0 && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-700">
            <ChefHat size={20} className="inline mr-2" />
            You have {localCount} recipe{localCount > 1 ? 's' : ''} saved!
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Loading recipes..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.slice(0, 6).map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <RecipeCard recipe={recipe} showRating showAuthor />
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white border-t-4 border-red-600 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm">
            <ChefHat size={20} className="text-red-600" />
            <span>Meal Finder - Your personal recipe library</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
