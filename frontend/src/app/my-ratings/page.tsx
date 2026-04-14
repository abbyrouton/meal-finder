'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner, ChefHat, StarRating } from '@/components';
import { useUserRatings } from '@/lib/hooks/useRecipes';

export default function MyRatingsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  const { data: ratings, isLoading, isError } = useUserRatings();

  // Redirect if not logged in
  if (isLoggedIn === false) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-black text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight">My Ratings</h1>
            <p className="text-gray-300 mt-2">Your recipe ratings</p>
          </div>
        </div>
        <div className="h-12 checkerboard-lg" />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ChefHat size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in required</h2>
            <p className="text-gray-500 mb-6">You must be signed in to view your ratings.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Loading state
  if (isLoggedIn === null || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-black text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight">My Ratings</h1>
            <p className="text-gray-300 mt-2">Your recipe ratings</p>
          </div>
        </div>
        <div className="h-12 checkerboard-lg" />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <LoadingSpinner message="Loading your ratings..." />
        </main>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-black text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 checkerboard-lg-dark opacity-20" />
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <ChefHat size={48} className="text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold tracking-tight">My Ratings</h1>
            <p className="text-gray-300 mt-2">Your recipe ratings</p>
          </div>
        </div>
        <div className="h-12 checkerboard-lg" />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ChefHat size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading ratings</h2>
            <p className="text-gray-500 mb-6">Something went wrong. Please try again.</p>
            <button
              onClick={() => router.refresh()}
              className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
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
          <h1 className="text-4xl font-bold tracking-tight">My Ratings</h1>
          <p className="text-gray-300 mt-2">
            {ratings && ratings.length > 0
              ? `You've rated ${ratings.length} recipe${ratings.length === 1 ? '' : 's'}`
              : 'Your recipe ratings'}
          </p>
        </div>
      </div>

      {/* Checkerboard divider */}
      <div className="h-12 checkerboard-lg" />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/recipes"
          className="inline-block mb-6 text-red-600 hover:text-red-700 font-medium"
        >
          &larr; Back to recipes
        </Link>

        {!ratings || ratings.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No ratings yet</h2>
            <p className="text-gray-500 mb-6">
              Start rating recipes to keep track of your favorites.
            </p>
            <Link
              href="/recipes"
              className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <Link
                key={rating.id}
                href={`/recipes/${rating.recipe_id}`}
                className="block bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-red-500 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {rating.recipe_title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                      {rating.recipe_cuisine_type && (
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          {rating.recipe_cuisine_type}
                        </span>
                      )}
                      {rating.recipe_prep_time && (
                        <span>{rating.recipe_prep_time} min</span>
                      )}
                    </div>
                    {rating.notes && (
                      <p className="text-gray-600 text-sm italic">"{rating.notes}"</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <StarRating rating={rating.score} />
                    <span className="text-sm text-gray-500 mt-1">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
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
