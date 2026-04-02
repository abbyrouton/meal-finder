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
        <LoadingSpinner message="Loading your recipes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Checkerboard accent */}
      <div className="h-2 checkerboard" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <ChefHat size={28} className="text-red-600" />
            My Recipes
          </h1>
          <span className="text-gray-500">{usingPlaceholder ? 0 : recipes.length} recipes</span>
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
