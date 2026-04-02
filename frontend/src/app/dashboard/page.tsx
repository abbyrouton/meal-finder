'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Recipe } from '@/types';
import { RecipeCard, LoadingSpinner, ErrorMessage, ChefHat, EmptyState } from '@/components';
import { fetchUserRecipes } from '@/lib/api';
import { placeholderRecipes } from '@/lib/placeholder-data';

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingPlaceholder, setUsingPlaceholder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadRecipes();
  }, [router]);

  const loadRecipes = async () => {
    try {
      const data = await fetchUserRecipes();
      if (data.length === 0) {
        setRecipes(placeholderRecipes.slice(0, 3));
        setUsingPlaceholder(true);
      } else {
        setRecipes(data);
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
      setRecipes(placeholderRecipes.slice(0, 3));
      setUsingPlaceholder(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-black text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight">My Recipes</h1>
            <p className="text-gray-300 mt-2">Your personal recipe collection</p>
          </div>
        </div>
        <div className="h-12 checkerboard-lg" />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <LoadingSpinner message="Loading your recipes..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight">My Recipes</h1>
          <p className="text-gray-300 mt-2">Your personal recipe collection</p>
        </div>
      </div>

      {/* Checkerboard divider */}
      <div className="h-12 checkerboard-lg" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-medium text-gray-700">
            {usingPlaceholder ? 0 : recipes.length} recipes
          </span>
          <Link
            href="/recipes/new"
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            + Add Recipe
          </Link>
        </div>

        {error && <ErrorMessage message={error} className="mb-6" />}

        {usingPlaceholder ? (
          <div className="space-y-8">
            <EmptyState
              icon="chef"
              title="Welcome to your kitchen!"
              description="Your personal recipe collection is empty. Start adding your favorite recipes and build your own digital cookbook."
              actionLabel="Add Your First Recipe"
              actionHref="/recipes/new"
              secondaryActionLabel="Browse All Recipes"
              secondaryActionHref="/recipes"
            />

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <ChefHat size={20} className="text-red-600" />
                Get inspired by these recipes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <div key={recipe.id}>
                    <RecipeCard recipe={recipe} showRating showAuthor />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <RecipeCard recipe={recipe} showRating />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
