'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Recipe } from '@/types';
import { RecipeCard, LoadingSpinner, ChefHat } from '@/components';
import { placeholderRecipes, topCuisines } from '@/lib/placeholder-data';

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
      const response = await fetch('/api/suggestions', {
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
        <LoadingSpinner message="Finding recipes for you..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 checkerboard-dark opacity-30" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Suggested For You</h1>
          <p className="text-lg text-gray-300">
            Recipes based on your highest-rated cuisine types
          </p>
        </div>
      </div>

      {/* Checkerboard divider */}
      <div className="h-4 checkerboard" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {usingPlaceholder && (
          <div className="mb-6 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-600">
            <ChefHat size={24} className="text-gray-400 mx-auto mb-2" />
            Showing sample suggestions. Rate some recipes to get personalized recommendations!
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
