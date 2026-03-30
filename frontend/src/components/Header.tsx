'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@/types';
import { ChefHat } from './ChefHat';

const publicRoutes = ['/login', '/signup'];

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  // Don't render header on login/signup pages
  if (publicRoutes.includes(pathname)) {
    return null;
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-black border-b-4 border-red-600">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="h-8" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-black border-b-4 border-red-600 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white hover:text-red-500 transition">
            <ChefHat size={32} className="text-red-600" />
            <span>Meal Finder</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/recipes"
              className={`text-sm font-medium transition ${
                isActive('/recipes')
                  ? 'text-red-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              All Recipes
            </Link>
            <Link
              href="/top-recipes"
              className={`text-sm font-medium transition ${
                isActive('/top-recipes')
                  ? 'text-red-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Top Rated
            </Link>
            {user && (
              <>
                <Link
                  href="/suggestions"
                  className={`text-sm font-medium transition ${
                    isActive('/suggestions')
                      ? 'text-red-500'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  For You
                </Link>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition ${
                    isActive('/dashboard')
                      ? 'text-red-500'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  My Recipes
                </Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/recipes/new"
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
            >
              + Add Recipe
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isActive('/profile')
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden lg:inline text-sm font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 border border-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-4 mt-3 pt-3 border-t border-gray-700 overflow-x-auto">
          <Link
            href="/recipes"
            className={`text-sm font-medium whitespace-nowrap transition ${
              isActive('/recipes') ? 'text-red-500' : 'text-gray-300'
            }`}
          >
            All Recipes
          </Link>
          <Link
            href="/top-recipes"
            className={`text-sm font-medium whitespace-nowrap transition ${
              isActive('/top-recipes') ? 'text-red-500' : 'text-gray-300'
            }`}
          >
            Top Rated
          </Link>
          {user && (
            <>
              <Link
                href="/suggestions"
                className={`text-sm font-medium whitespace-nowrap transition ${
                  isActive('/suggestions') ? 'text-red-500' : 'text-gray-300'
                }`}
              >
                For You
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium whitespace-nowrap transition ${
                  isActive('/dashboard') ? 'text-red-500' : 'text-gray-300'
                }`}
              >
                My Recipes
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
