'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StarRating, LoadingSpinner, ErrorMessage, ChefHat } from '@/components';
import { getPlaceholderRecipe, RecipeDetail } from '@/lib/placeholder-data';
import { getLocalRecipe, deleteLocalRecipe } from '@/lib/local-recipes';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [isLocalRecipe, setIsLocalRecipe] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchRecipe(params.id as string);
    }
  }, [params.id]);

  const fetchRecipe = async (id: string) => {
    // Check if it's a local recipe
    if (id.startsWith('local-')) {
      const localRecipe = getLocalRecipe(id);
      if (localRecipe) {
        setRecipe(localRecipe);
        setIsLocalRecipe(true);
      } else {
        setError('Recipe not found');
      }
      setLoading(false);
      return;
    }

    // Check if it's a placeholder recipe
    if (id.startsWith('placeholder-')) {
      const placeholderRecipe = getPlaceholderRecipe(id);
      if (placeholderRecipe) {
        setRecipe(placeholderRecipe);
        setIsPlaceholder(true);
      } else {
        setError('Recipe not found');
      }
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/recipes/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Recipe not found');
        }
        throw new Error('Failed to load recipe');
      }
      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating: number) => {
    setRatingLoading(true);
    setUserRating(rating);
    setRatingLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    if (isLocalRecipe) {
      deleteLocalRecipe(params.id as string);
      router.push('/recipes');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/recipes/${params.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      router.push('/recipes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <LoadingSpinner message="Loading recipe..." />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-2 checkerboard" />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Recipe not found'} />
          <Link
            href="/recipes"
            className="inline-block mt-4 text-red-600 hover:text-red-700"
          >
            &larr; Back to recipes
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Checkerboard accent */}
      <div className="h-2 checkerboard" />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/recipes"
          className="inline-block mb-4 text-red-600 hover:text-red-700"
        >
          &larr; Back to recipes
        </Link>

        {isLocalRecipe && (
          <div className="mb-4 p-3 bg-green-50 border-2 border-green-200 rounded-lg text-center text-green-700 text-sm">
            <ChefHat size={18} className="inline mr-2" />
            This is your recipe, saved locally in your browser.
          </div>
        )}

        {isPlaceholder && (
          <div className="mb-4 p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-600 text-sm">
            This is a sample recipe. Add your own recipes to get started!
          </div>
        )}

        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          <div className="p-8">
            {/* Title and Actions */}
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ChefHat size={36} className="text-red-600" />
                {recipe.title}
              </h1>
              <div className="flex gap-2">
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Edit
                </Link>
                {(isLocalRecipe || (!isPlaceholder && !isLocalRecipe)) && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <StarRating rating={recipe.avg_rating || 0} />
                <span className="text-gray-500">({(recipe.avg_rating || 0).toFixed(1)})</span>
              </div>
              {recipe.cuisine_type && (
                <span className="px-3 py-1 bg-black text-white rounded-full">
                  {recipe.cuisine_type}
                </span>
              )}
              {recipe.prep_time && (
                <span className="text-gray-500">{recipe.prep_time} min</span>
              )}
              {recipe.user_name && (
                <span className="text-gray-500">By {recipe.user_name}</span>
              )}
            </div>

            {/* Description */}
            {recipe.description && (
              <p className="text-gray-600 mb-6 text-lg">{recipe.description}</p>
            )}

            {/* Ingredients */}
            {recipe.ingredients && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-6 bg-red-600 rounded" />
                  Ingredients
                </h2>
                <div className="bg-gray-50 border-l-4 border-red-600 rounded-r-lg p-4">
                  <ul className="space-y-2">
                    {recipe.ingredients.split('\n').filter(line => line.trim()).map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 mt-1">•</span>
                        <span>{ingredient.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Instructions */}
            {recipe.steps && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-6 bg-black rounded" />
                  Instructions
                </h2>
                <div className="bg-gray-50 border-l-4 border-black rounded-r-lg p-4">
                  <div className="space-y-4">
                    {recipe.steps.split('\n').filter(line => line.trim()).map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <p className="text-gray-700">{step.replace(/^\d+\.\s*/, '').trim()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {recipe.notes && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ChefHat size={20} className="text-red-600" />
                  Chef's Notes
                </h2>
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-gray-700 italic">{recipe.notes}</p>
                </div>
              </div>
            )}

            {/* Rate This Recipe */}
            <div className="border-t-2 border-gray-200 pt-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Rate this recipe</h2>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    disabled={ratingLoading}
                    className={`text-3xl transition ${
                      star <= userRating ? 'text-red-500' : 'text-gray-300'
                    } hover:text-red-500 disabled:opacity-50`}
                  >
                    &#9733;
                  </button>
                ))}
                {userRating > 0 && (
                  <span className="ml-2 text-gray-500">You rated: {userRating} stars</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
