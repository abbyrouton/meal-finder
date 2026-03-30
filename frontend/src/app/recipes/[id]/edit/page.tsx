'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner, ErrorMessage, ChefHat } from '@/components';
import { getPlaceholderRecipe, RecipeDetail } from '@/lib/placeholder-data';
import { getLocalRecipe, updateLocalRecipe } from '@/lib/local-recipes';

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocalRecipe, setIsLocalRecipe] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [notes, setNotes] = useState('');

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
        setTitle(localRecipe.title);
        setDescription(localRecipe.description || '');
        setCuisineType(localRecipe.cuisine_type || '');
        setPrepTime(localRecipe.prep_time?.toString() || '');
        setIngredients(localRecipe.ingredients || '');
        setSteps(localRecipe.steps || '');
        setNotes(localRecipe.notes || '');
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
        setTitle(placeholderRecipe.title);
        setDescription(placeholderRecipe.description || '');
        setCuisineType(placeholderRecipe.cuisine_type || '');
        setPrepTime(placeholderRecipe.prep_time?.toString() || '');
        setIngredients(placeholderRecipe.ingredients || '');
        setSteps(placeholderRecipe.steps || '');
        setNotes(placeholderRecipe.notes || '');
        setIsPlaceholder(true);
      } else {
        setError('Recipe not found');
      }
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Failed to load recipe');
      }

      const data: RecipeDetail = await response.json();

      setTitle(data.title);
      setDescription(data.description || '');
      setCuisineType(data.cuisine_type || '');
      setPrepTime(data.prep_time?.toString() || '');
      setIngredients(data.ingredients || '');
      setSteps(data.steps || '');
      setNotes(data.notes || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const recipeData = {
      title,
      description: description || null,
      cuisine_type: cuisineType || null,
      prep_time: prepTime ? parseInt(prepTime) : null,
      ingredients: ingredients || '',
      steps: steps || '',
      notes: notes || '',
    };

    // Handle local recipe update
    if (isLocalRecipe) {
      updateLocalRecipe(params.id as string, recipeData);
      router.push(`/recipes/${params.id}`);
      return;
    }

    // Handle placeholder - can't actually edit, just redirect
    if (isPlaceholder) {
      router.push(`/recipes/${params.id}`);
      return;
    }

    // Handle API recipe
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/recipes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update recipe');
      }

      router.push(`/recipes/${params.id}`);
    } catch {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <LoadingSpinner message="Loading recipe..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Checkerboard accent */}
      <div className="h-2 checkerboard" />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <ChefHat size={28} className="text-red-600" />
          Edit Recipe
        </h1>

        {isPlaceholder && (
          <div className="mb-6 p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-600 text-sm">
            This is a sample recipe and cannot be edited. Add your own recipe instead!
          </div>
        )}

        {isLocalRecipe && (
          <div className="mb-6 p-3 bg-green-50 border-2 border-green-200 rounded-lg text-center text-green-700 text-sm">
            <ChefHat size={18} className="inline mr-2" />
            Editing your locally saved recipe.
          </div>
        )}

        {error && <ErrorMessage message={error} className="mb-6" />}

        <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">
              Recipe Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isPlaceholder}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              disabled={isPlaceholder}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-900 mb-1">
                Cuisine Type
              </label>
              <input
                id="cuisineType"
                type="text"
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                disabled={isPlaceholder}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-gray-900 mb-1">
                Prep Time (minutes)
              </label>
              <input
                id="prepTime"
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                min="1"
                disabled={isPlaceholder}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-900 mb-1">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={4}
              disabled={isPlaceholder}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-gray-900 mb-1">
              Instructions
            </label>
            <textarea
              id="steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              rows={6}
              disabled={isPlaceholder}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              disabled={isPlaceholder}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition disabled:bg-gray-100"
            />
          </div>

          <div className="flex gap-4">
            {!isPlaceholder && (
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
            <Link
              href={`/recipes/${params.id}`}
              className={`px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center ${isPlaceholder ? 'flex-1' : ''}`}
            >
              {isPlaceholder ? 'Back to Recipe' : 'Cancel'}
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
