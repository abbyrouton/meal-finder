'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  cuisine_type: string | null;
  prep_time: number | null;
  user_name: string | null;
  avg_rating: number;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/public/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">&#9733;</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">&#9733;</span>);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">Meal Finder</h1>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                My Recipes
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Discover Delicious Recipes</h2>
          <p className="text-xl opacity-90">
            Browse community recipes, ratings, and find your next favorite meal
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">All Recipes</h2>
          <span className="text-gray-500">{recipes.length} recipes</span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-orange-600">Loading recipes...</div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500">No recipes yet. Be the first to add one!</p>
            {!isLoggedIn && (
              <Link
                href="/login"
                className="inline-block mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Sign in to add recipes
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {recipe.title}
                    </h3>
                    {recipe.prep_time && (
                      <span className="text-sm text-gray-500">
                        {recipe.prep_time} min
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(recipe.avg_rating)}</div>
                    <span className="text-sm text-gray-500">
                      ({recipe.avg_rating.toFixed(1)})
                    </span>
                  </div>

                  {recipe.cuisine_type && (
                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full mb-2">
                      {recipe.cuisine_type}
                    </span>
                  )}

                  {recipe.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {recipe.description}
                    </p>
                  )}

                  {recipe.user_name && (
                    <p className="text-xs text-gray-400">
                      By {recipe.user_name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          Meal Finder - Your personal recipe library
        </div>
      </footer>
    </div>
  );
}
