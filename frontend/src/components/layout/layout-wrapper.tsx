import type { ReactNode } from 'react';
import { AppLayout } from './app-layout';
import { AuthLayout } from './auth-layout';
import { MarketingLayout } from './marketing-layout';

export type LayoutVariant = 'app' | 'auth' | 'marketing';

interface LayoutWrapperProps {
  children: ReactNode;
  variant?: LayoutVariant;
}

export function LayoutWrapper({
  children,
  variant = 'marketing',
}: LayoutWrapperProps) {
  switch (variant) {
    case 'app':
      return <AppLayout>{children}</AppLayout>;
    case 'auth':
      return (
        <AuthLayout title="Welcome" showLogo={false}>
          {children}
        </AuthLayout>
      );
    default:
      return <MarketingLayout>{children}</MarketingLayout>;
  }
}

// Type for pages with layout variant
export type PageWithLayout<P = {}> = P & {
  layoutVariant?: LayoutVariant;
};