import { ChefHat } from './ChefHat';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message = 'Loading...', fullScreen = false }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <ChefHat size={48} className="text-red-600 mx-auto mb-4 animate-bounce" />
          <div className="text-xl text-gray-900">{message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <ChefHat size={48} className="text-red-600 mx-auto mb-4 animate-bounce" />
      <div className="text-xl text-gray-900">{message}</div>
    </div>
  );
}
