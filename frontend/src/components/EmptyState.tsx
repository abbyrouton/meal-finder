'use client';

import Link from 'next/link';
import { ChefHat } from './ChefHat';

interface EmptyStateProps {
  icon?: 'chef' | 'search' | 'star' | 'heart';
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
}

export function EmptyState({
  icon = 'chef',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
}: EmptyStateProps) {
  const iconColor = {
    chef: 'text-red-600',
    search: 'text-gray-400',
    star: 'text-yellow-500',
    heart: 'text-pink-500',
  }[icon];

  return (
    <div className="text-center py-12 px-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
      <div className="mb-4">
        <ChefHat size={56} className={`mx-auto ${iconColor}`} />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
          >
            {actionLabel}
          </Link>
        )}

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
          >
            {actionLabel}
          </button>
        )}

        {secondaryActionLabel && secondaryActionHref && (
          <Link
            href={secondaryActionHref}
            className="inline-block px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-400 transition"
          >
            {secondaryActionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
