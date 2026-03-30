interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

export function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  const fullStars = Math.floor(rating);

  return (
    <div className="flex">
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          key={i}
          className={i < fullStars ? 'text-red-500' : 'text-gray-300'}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}
