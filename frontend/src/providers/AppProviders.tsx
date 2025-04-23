import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { store } from '@/lib/store';

interface AppProvidersProps extends PropsWithChildren {
  session?: any; // We'll properly type this when we set up NextAuth
}

export function AppProviders({ children, session }: AppProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <SessionProvider session={session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}

// Re-export store hooks for easy access
export {
  useAppDispatch,
  useAppSelector,
  useAuth,
  useCurrentInterview,
  useTrainingProgress,
} from '@/lib/store/hooks';