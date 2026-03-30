interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`p-4 bg-red-50 border-2 border-red-500 text-red-700 rounded-lg ${className}`}>
      {message}
    </div>
  );
}
