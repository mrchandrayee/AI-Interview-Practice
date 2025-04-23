import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  helpText,
  leftIcon,
  rightIcon,
  type = 'text',
  disabled,
  containerClassName,
  ...props
}, ref) => {
  const inputStyles = cn(
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    error && 'border-error focus-visible:ring-error',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    className
  );

  const iconStyles = 'absolute top-1/2 -translate-y-1/2 text-gray-400';

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={cn(iconStyles, 'left-3')}>
            {leftIcon}
          </div>
        )}
        
        <input
          type={type}
          className={inputStyles}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        
        {rightIcon && (
          <div className={cn(iconStyles, 'right-3')}>
            {rightIcon}
          </div>
        )}
      </div>

      {(helpText || error) && (
        <p className={cn(
          'text-xs',
          error ? 'text-error' : 'text-muted-foreground'
        )}>
          {error || helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };