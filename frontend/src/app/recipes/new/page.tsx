'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ErrorMessage, ChefHat } from '@/components';
import { saveLocalRecipe } from '@/lib/local-recipes';

export default function NewRecipePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Save to local storage
      const newRecipe = saveLocalRecipe({
        title,
        description: description || null,
        cuisine_type: cuisineType || null,
        prep_time: prepTime ? parseInt(prepTime) : null,
        ingredients: ingredients || '',
        steps: steps || '',
        notes: notes || '',
      });

      // Redirect to the new recipe
      router.push(`/recipes/${newRecipe.id}`);
    } catch {
      setError('Failed to save recipe');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Checkerboard accent */}
      <div className="h-2 checkerboard" />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <ChefHat size={28} className="text-red-600" />
          Add New Recipe
        </h1>

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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="e.g., Grandma's Chicken Soup"
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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="A brief description of this recipe"
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
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                placeholder="e.g., Italian, Mexican"
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
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                placeholder="30"
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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="List each ingredient on a new line"
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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="Step-by-step cooking instructions"
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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="Tips, variations, or personal notes"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Recipe'}
            </button>
            <Link
              href="/recipes"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
