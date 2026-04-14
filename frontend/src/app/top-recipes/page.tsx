'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recipe } from '@/types';
import { LoadingSpinner, ChefHat } from '@/components';
import { placeholderRecipes } from '@/lib/placeholder-data';
import { API_BASE } from '@/lib/api';

export default function TopRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingPlaceholder, setUsingPlaceholder] = useState(false);

  useEffect(() => {
    fetchTopRecipes();
  }, []);

  const fetchTopRecipes = async () => {
    try {
      const response = await fetch(`${API_BASE}/recipes/top`);
      if (!response.ok) {
        throw new Error('Failed to load top recipes');
      }
      const data = await response.json();
      if (data.length === 0) {
        // Sort placeholder by rating and use as fallback
        const sorted = [...placeholderRecipes].sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
        setRecipes(sorted);
        setUsingPlaceholder(true);
      } else {
        setRecipes(data);
      }
    } catch {
      const sorted = [...placeholderRecipes].sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
      setRecipes(sorted);
      setUsingPlaceholder(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight">Top Rated Recipes</h1>
          <p className="text-gray-300 mt-2">
            The highest rated recipes from our community
          </p>
        </div>
      </div>

      {/* Checkerboard divider */}
      <div className="h-12 checkerboard-lg" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {usingPlaceholder && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg text-center">
            <ChefHat size={24} className="text-red-500 mx-auto mb-2" />
            <p className="text-gray-700 font-medium">These are sample recipes to get you started!</p>
            <p className="text-gray-500 text-sm mt-1">Sign in to rate recipes and see real community favorites.</p>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Loading top recipes..." />
        ) : (
          <div className="space-y-4">
            {recipes.map((recipe, index) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="block">
                <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-red-500 hover:shadow-lg transition flex items-center">
                  <div className="w-16 h-full min-h-[80px] bg-black flex items-center justify-center text-white text-2xl font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          <ChefHat size={18} className="text-red-600" />
                          {recipe.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          {recipe.cuisine_type && (
                            <span className="px-2 py-1 bg-black text-white rounded-full text-xs">
                              {recipe.cuisine_type}
                            </span>
                          )}
                          {recipe.prep_time && <span>{recipe.prep_time} min</span>}
                          {recipe.user_name && <span>By {recipe.user_name}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl text-red-500">&#9733;</span>
                        <span className="text-xl font-semibold text-gray-900">
                          {recipe.avg_rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
