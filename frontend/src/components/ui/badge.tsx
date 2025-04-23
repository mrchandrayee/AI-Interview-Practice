import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  success: 'bg-success text-success-foreground hover:bg-success/80',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/80',
  error: 'bg-error text-error-foreground hover:bg-error/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1',
};

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}

// Predefined badge variants for common use cases
export function StatusBadge({
  status,
  className,
  ...props
}: BadgeProps & {
  status: 'active' | 'pending' | 'completed' | 'failed' | 'cancelled';
}) {
  const statusStyles = {
    active: { variant: 'success' as const, text: 'Active' },
    pending: { variant: 'warning' as const, text: 'Pending' },
    completed: { variant: 'success' as const, text: 'Completed' },
    failed: { variant: 'error' as const, text: 'Failed' },
    cancelled: { variant: 'secondary' as const, text: 'Cancelled' },
  };

  const { variant, text } = statusStyles[status];

  return (
    <Badge variant={variant} className={className} {...props}>
      <span className="mr-1 inline-block h-2 w-2 rounded-full bg-current" />
      {text}
    </Badge>
  );
}

export function ProgressBadge({
  progress,
  className,
  ...props
}: BadgeProps & {
  progress: number;
}) {
  let variant: BadgeProps['variant'] = 'default';
  if (progress >= 100) variant = 'success';
  else if (progress >= 60) variant = 'secondary';
  else if (progress >= 30) variant = 'warning';
  else variant = 'error';

  return (
    <Badge variant={variant} className={className} {...props}>
      {`${Math.round(progress)}%`}
    </Badge>
  );
}

export function TierBadge({
  tier,
  className,
  ...props
}: BadgeProps & {
  tier: 'free' | 'popular' | 'elite';
}) {
  const tierStyles = {
    free: { variant: 'secondary' as const, text: 'Free' },
    popular: { variant: 'success' as const, text: 'Popular' },
    elite: { variant: 'default' as const, text: 'Elite' },
  };

  const { variant, text } = tierStyles[tier];

  return (
    <Badge variant={variant} className={className} {...props}>
      {text}
    </Badge>
  );
}