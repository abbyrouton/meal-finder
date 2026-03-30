interface ChefHatProps {
  className?: string;
  size?: number;
}

export function ChefHat({ className = '', size = 24 }: ChefHatProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C9.5 2 7.5 3.5 7 5.5C5 5.5 3 7.5 3 10C3 12.5 5 14.5 7 14.5V19C7 20.1 7.9 21 9 21H15C16.1 21 17 20.1 17 19V14.5C19 14.5 21 12.5 21 10C21 7.5 19 5.5 17 5.5C16.5 3.5 14.5 2 12 2ZM9 17V14.5H15V17H9Z" />
    </svg>
  );
}
