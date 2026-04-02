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
      <div className="bg-black text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <ChefHat size={72} className="text-red-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Discover Delicious Recipes</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse community recipes, ratings, and find your next favorite meal
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/recipes"
              className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-lg"
            >
              Browse Recipes
            </Link>
            <Link
              href="/recipes/new"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition text-lg"
            >
              Add Recipe
            </Link>
          </div>
        </div>
      </div>

      {/* Large Checkerboard divider */}
      <div className="h-16 checkerboard-lg" />

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

      {/* Checkerboard divider before footer */}
      <div className="h-16 checkerboard-lg mt-12" />

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <ChefHat size={24} className="text-red-600" />
            <span className="text-lg font-semibold">Meal Finder</span>
          </div>
          <p className="text-gray-400 mt-2">Your personal recipe library</p>
        </div>
      </footer>
    </div>
  );
}
