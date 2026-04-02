'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Recipe } from '@/types';
import { RecipeCard, LoadingSpinner, ChefHat, EmptyState } from '@/components';
import { placeholderRecipes, topCuisines } from '@/lib/placeholder-data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface SuggestionData {
  top_cuisines: string[];
  suggestions: Recipe[];
}

export default function SuggestionsPage() {
  const [data, setData] = useState<SuggestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingPlaceholder, setUsingPlaceholder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Show placeholder for non-logged-in users
      const suggestions = placeholderRecipes.filter(r =>
        topCuisines.includes(r.cuisine_type || '')
      );
      setData({ top_cuisines: topCuisines, suggestions });
      setUsingPlaceholder(true);
      setLoading(false);
      return;
    }
    fetchSuggestions(token);
  }, [router]);

  const fetchSuggestions = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/suggestions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load suggestions');
      }

      const result = await response.json();
      if (!result.suggestions || result.suggestions.length === 0) {
        const suggestions = placeholderRecipes.filter(r =>
          topCuisines.includes(r.cuisine_type || '')
        );
        setData({ top_cuisines: topCuisines, suggestions });
        setUsingPlaceholder(true);
      } else {
        setData(result);
      }
    } catch {
      const suggestions = placeholderRecipes.filter(r =>
        topCuisines.includes(r.cuisine_type || '')
      );
      setData({ top_cuisines: topCuisines, suggestions });
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
            <h1 className="text-4xl font-bold tracking-tight">For You</h1>
            <p className="text-gray-300 mt-2">Personalized recipe suggestions</p>
          </div>
        </div>
        <div className="h-12 checkerboard-lg" />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <LoadingSpinner message="Finding recipes for you..." />
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
          <h1 className="text-4xl font-bold tracking-tight">For You</h1>
          <p className="text-gray-300 mt-2">
            Recipes based on your highest-rated cuisine types
          </p>
        </div>
      </div>

      {/* Checkerboard divider */}
      <div className="h-12 checkerboard-lg" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {usingPlaceholder && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg text-center">
            <ChefHat size={24} className="text-purple-500 mx-auto mb-2" />
            <p className="text-gray-700 font-medium">We're showing you popular recipes to explore!</p>
            <p className="text-gray-500 text-sm mt-1">Rate some recipes and we'll learn your taste to give personalized suggestions.</p>
          </div>
        )}

        {data?.top_cuisines && data.top_cuisines.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              {usingPlaceholder ? 'Popular cuisines:' : 'Your favorite cuisines:'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.top_cuisines.map((cuisine) => (
                <span
                  key={cuisine}
                  className="px-4 py-2 bg-black text-white rounded-full font-medium"
                >
                  {cuisine}
                </span>
              ))}
            </div>
          </div>
        )}

        {data?.suggestions && data.suggestions.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChefHat size={24} className="text-red-600" />
              Recipes you might like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.suggestions.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                  <RecipeCard recipe={recipe} showRating showAuthor />
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
