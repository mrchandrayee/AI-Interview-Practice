import { createElement } from 'react';
import { ErrorLayout, type ErrorLayoutProps } from './error-layout';
import {
  ThemeProvider,
  ThemeToggle,
  useTheme,
  type Theme,
} from './theme-provider';

// Layout components
export { AppLayout } from './app-layout';
export { AuthLayout } from './auth-layout';
export { MarketingLayout } from './marketing-layout';
// Core layout components
export { ErrorLayout } from './error-layout';
export { Header } from './header';
export { Footer } from './footer';

// Theme management
export {
  ThemeProvider,
  ThemeToggle,
  useTheme,
  type Theme,
} from './theme-provider';

// Layout management
export {
  LayoutWrapper,
  type LayoutVariant,
  type PageWithLayout,
} from './layout-wrapper';

// Page transitions
export {
  PageTransition,
  LayoutTransition,
} from './page-transition';

// Predefined navigation items
export const mainNavItems = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const dashboardNavItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/interviews', label: 'Interviews' },
  { href: '/training', label: 'Training' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/settings', label: 'Settings' },
];

// Error page utilities
export function createErrorPage(props: ErrorLayoutProps) {
  return () => createElement(ErrorLayout, props);
}

// Common error pages
export const NotFoundPage = createErrorPage({ code: '404' });
export const ServerErrorPage = createErrorPage({ code: '500' });

// Re-export common types
export type { ErrorLayoutProps } from './error-layout';

// Animation variants for transitions
export const transitions = {
  page: {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
  layout: {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
};

// Example usage:
/*
// In _app.tsx
import type { AppProps } from 'next/app';
import { PageWithLayout, LayoutWrapper } from '@/components/layout';

type AppPropsWithLayout = AppProps & {
  Component: PageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // You can get the layout variant from the Component or route
  const layoutVariant = Component.layoutVariant || 'marketing';

  return (
    <LayoutWrapper variant={layoutVariant}>
      <Component {...pageProps} />
    </LayoutWrapper>
  );
}

// In a page component
import type { PageWithLayout } from '@/components/layout';

const YourPage: PageWithLayout = () => {
  return <div>Your content here</div>;
};

YourPage.layoutVariant = 'app' as const;

export default YourPage;
*/