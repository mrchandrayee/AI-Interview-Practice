import type { HTMLAttributes } from 'react';

// Common style variants
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ColorScheme = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type Position = 'top' | 'right' | 'bottom' | 'left';
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Common component props
export interface StyleableProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}

export interface LoadableProps {
  isLoading?: boolean;
  loadingText?: string;
}

export interface ColorSchemeProps {
  colorScheme?: ColorScheme;
  variant?: Variant;
}

export interface SizeableProps {
  size?: Size;
}

// Layout specific types
export type Direction = 'horizontal' | 'vertical';
export type LayoutType = 'fixed' | 'fluid';
export type Alignment = 'start' | 'center' | 'end' | 'stretch';
export type Distribution = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface LayoutProps extends StyleableProps {
  direction?: Direction;
  type?: LayoutType;
  align?: Alignment;
  justify?: Distribution;
  wrap?: boolean;
  gap?: number | string;
  padding?: number | string;
  margin?: number | string;
}

// Animation types
export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate';
export type AnimationDirection = 'up' | 'right' | 'down' | 'left';

export interface AnimationProps {
  type?: AnimationType;
  direction?: AnimationDirection;
  duration?: number;
  delay?: number;
}

// Theme related types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorMode = 'light' | 'dark';

export interface ThemeProviderProps {
  defaultTheme?: ThemeMode;
  storageKey?: string;
}

// Utility types for components
export type DivProps = StyleableProps & HTMLAttributes<HTMLDivElement>;
export type ButtonProps = StyleableProps & 
  LoadableProps & 
  ColorSchemeProps & 
  SizeableProps & 
  React.ButtonHTMLAttributes<HTMLButtonElement>;

// Helper type for responsive values
export type ResponsiveValue<T> = T | { [key in 'base' | 'sm' | 'md' | 'lg' | 'xl']?: T };

// Helper function to get responsive class names
export const getResponsiveClass = <T extends string>(
  value: ResponsiveValue<T> | undefined,
  classMap: Record<T, string>,
  baseClass?: string
): string => {
  if (!value) return baseClass || '';
  if (typeof value === 'string') return classMap[value];

  const classes = [];
  if (baseClass) classes.push(baseClass);
  
  if (value.base) classes.push(classMap[value.base]);
  if (value.sm) classes.push(`sm:${classMap[value.sm]}`);
  if (value.md) classes.push(`md:${classMap[value.md]}`);
  if (value.lg) classes.push(`lg:${classMap[value.lg]}`);
  if (value.xl) classes.push(`xl:${classMap[value.xl]}`);

  return classes.join(' ');
};

// Example usage:
/*
// Component props with responsive values
interface CardProps extends StyleableProps {
  padding?: ResponsiveValue<Size>;
  align?: ResponsiveValue<Alignment>;
}

const paddingClasses: Record<Size, string> = {
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

function Card({ padding, align, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        getResponsiveClass(padding, paddingClasses),
        getResponsiveClass(align, alignmentClasses),
        className
      )}
      {...props}
    />
  );
}

// Usage with responsive values
<Card
  padding={{ base: 'sm', md: 'md', lg: 'lg' }}
  align={{ base: 'start', md: 'center' }}
/>
*/