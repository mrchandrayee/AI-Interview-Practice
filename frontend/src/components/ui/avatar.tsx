import { forwardRef } from 'react';
import Image from 'next/image';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  isLoading?: boolean;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
};

const statusClasses = {
  online: 'bg-success',
  offline: 'bg-muted',
  away: 'bg-warning',
  busy: 'bg-error',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({
  className,
  src,
  alt = '',
  fallback,
  size = 'md',
  status,
  isLoading = false,
  ...props
}, ref) => {
  const initials = fallback ? getInitials(fallback) : alt ? getInitials(alt) : '?';

  return (
    <div
      ref={ref}
      className={cn('relative inline-block', className)}
      {...props}
    >
      <div
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          sizeClasses[size],
          isLoading && 'animate-pulse bg-muted'
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={`(max-width: 768px) ${sizeClasses[size]}, ${sizeClasses[size]}`}
          />
        ) : (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center rounded-full bg-muted',
              !isLoading && 'text-muted-foreground'
            )}
          >
            {!isLoading && initials}
          </div>
        )}
      </div>
      
      {status && (
        <span
          className={cn(
            'absolute right-0 top-0 block h-2 w-2 rounded-full ring-2 ring-background',
            statusClasses[status]
          )}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

// Avatar group component for displaying multiple avatars
interface AvatarGroupProps {
  avatars: Array<Omit<AvatarProps, 'size'> & { key?: string }>;
  size?: AvatarProps['size'];
  max?: number;
  className?: string;
}

export function AvatarGroup({
  avatars,
  size = 'md',
  max = 4,
  className,
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div
      className={cn(
        'flex -space-x-2',
        className
      )}
    >
      {visible.map((avatar, i) => (
        <Avatar
          key={avatar.key || i}
          {...avatar}
          size={size}
          className={cn(
            'ring-2 ring-background',
            avatar.className
          )}
        />
      ))}
      
      {remaining > 0 && (
        <div
          className={cn(
            'relative flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-background',
            sizeClasses[size]
          )}
        >
          <span className="text-xs font-medium">+{remaining}</span>
        </div>
      )}
    </div>
  );
}

// Example usage:
/*
// Single avatar
<Avatar
  src="/path/to/image.jpg"
  alt="John Doe"
  fallback="John Doe"
  size="lg"
  status="online"
/>

// Avatar group
<AvatarGroup
  avatars={[
    { src: "/user1.jpg", alt: "User 1" },
    { src: "/user2.jpg", alt: "User 2" },
    { src: "/user3.jpg", alt: "User 3" },
    { src: "/user4.jpg", alt: "User 4" },
    { src: "/user5.jpg", alt: "User 5" },
  ]}
  size="md"
  max={3}
/>
*/