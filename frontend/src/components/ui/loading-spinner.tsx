import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary';
  text?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const variantClasses = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
};

export function LoadingSpinner({
  className,
  size = 'md',
  variant = 'default',
  text,
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <svg
        className={cn(
          'animate-spin',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className="text-sm font-medium text-muted-foreground">{text}</span>
      )}
    </div>
  );
}

// Loading overlay component for blocking UI during loading
interface LoadingOverlayProps {
  text?: string;
}

export function LoadingOverlay({ text = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Loading container for loading states within components
interface LoadingContainerProps {
  loading: boolean;
  children: React.ReactNode;
  text?: string;
  className?: string;
}

export function LoadingContainer({
  loading,
  children,
  text,
  className,
}: LoadingContainerProps) {
  if (!loading) return <>{children}</>;

  return (
    <div className={cn('relative min-h-[100px]', className)}>
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
        <LoadingSpinner text={text} />
      </div>
      <div className="pointer-events-none opacity-50">{children}</div>
    </div>
  );
}

// Example usage:
/*
// Simple spinner
<LoadingSpinner />

// Spinner with text
<LoadingSpinner text="Processing..." />

// Full-screen overlay
<LoadingOverlay text="Uploading file..." />

// Loading container
<LoadingContainer loading={isLoading} text="Loading data...">
  <div>Your content here</div>
</LoadingContainer>
*/