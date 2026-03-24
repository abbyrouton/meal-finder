'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  cuisine_type: string | null;
  prep_time: number | null;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchRecipes(token);
  }, [router]);

  const fetchRecipes = async (token: string) => {
    try {
      const response = await fetch('/api/recipes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100">
        <div className="text-xl text-orange-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">Meal Finder</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, <span className="font-semibold">{user?.name}</span>
              {user?.role === 'admin' && (
                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  Admin
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Recipes</h2>
          <span className="text-gray-500">{recipes.length} recipes</span>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {recipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500">No recipes yet. Start adding some!</p>
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
                  {recipe.cuisine_type && (
                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full mb-2">
                      {recipe.cuisine_type}
                    </span>
                  )}
                  {recipe.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {recipe.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
