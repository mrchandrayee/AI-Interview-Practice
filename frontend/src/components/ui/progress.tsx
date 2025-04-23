import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  indeterminate?: boolean;
  formatValue?: (value: number) => string;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(({
  className,
  value,
  max = 100,
  showValue = false,
  size = 'md',
  variant = 'default',
  indeterminate = false,
  formatValue = (val) => `${Math.round((val / max) * 100)}%`,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div
      ref={ref}
      className={cn('relative w-full overflow-hidden rounded-full bg-secondary/20', 
        sizes[size],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full w-full flex-1 transition-all',
          variants[variant],
          indeterminate && 'animate-indeterminate-progress',
          !indeterminate && `transition-[width] duration-500`
        )}
        style={{
          width: indeterminate ? '100%' : `${percentage}%`,
        }}
      />
      {showValue && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium">
          {formatValue(value)}
        </div>
      )}
    </div>
  );
});

Progress.displayName = 'Progress';

export { Progress };