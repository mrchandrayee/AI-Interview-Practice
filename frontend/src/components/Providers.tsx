'use client';

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { AppProviders } from "@/providers/AppProviders";

export function Providers({ children, session }: { children: React.ReactNode; session: any }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <AppProviders>
          {children}
        </AppProviders>
      </Provider>
    </SessionProvider>
  );
} 