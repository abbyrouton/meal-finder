import { Recipe } from '@/types';
import { StarRating } from './StarRating';
import { ChefHat } from './ChefHat';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  showAuthor?: boolean;
  showRating?: boolean;
}

export function RecipeCard({ recipe, showAuthor = false, showRating = false }: RecipeCardProps) {
  const cardStyles = cn(
    // Base styles
    "recipe-card bg-white border-2 border-gray-200 rounded-xl overflow-hidden",
    // Hover effects
    "hover:border-red-500 hover:shadow-lg",
    // Transitions
    "transition-all duration-200 group",
    // Focus styles for accessibility
    "focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2"
  );

  return (
    <article className={cardStyles} aria-label={`Recipe: ${recipe.title}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <ChefHat
              size={20}
              className="text-red-600 opacity-0 group-hover:opacity-100 transition"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold text-gray-900">{recipe.title}</h3>
          </div>
          {recipe.prep_time && (
            <span className="text-sm text-gray-500">{recipe.prep_time} min</span>
          )}
        </div>

        {showRating && recipe.avg_rating != null && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={recipe.avg_rating} />
            <span className="text-sm text-gray-500">({recipe.avg_rating.toFixed(1)})</span>
          </div>
        )}

        {recipe.cuisine_type && (
          <span className="inline-block px-2 py-1 bg-black text-white text-xs rounded-full mb-2">
            {recipe.cuisine_type}
          </span>
        )}

        {recipe.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{recipe.description}</p>
        )}

        {showAuthor && recipe.user_name && (
          <p className="text-xs text-gray-400">By {recipe.user_name}</p>
        )}
      </div>
    </article>
  );
}
