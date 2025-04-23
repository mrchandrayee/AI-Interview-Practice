'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface IntercomFunc {
  (...args: any[]): void;
  c?: (...args: any[]) => void;
  q?: any[];
}

declare global {
  interface Window {
    Intercom: IntercomFunc;
    intercomSettings: Record<string, any>;
  }
}

const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || 'your_app_id';

export function IntercomProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Intercom script
    (function() {
      var w = window;
      var ic = w.Intercom;
      if (typeof ic === "function") {
        ic('reattach_activator');
        ic('update', w.intercomSettings);
      } else {
        var d = document;
        var i: IntercomFunc = function() {
          if (i.c) i.c(arguments);
        };
        i.q = [];
        i.c = function(args) {
          if (i.q) i.q.push(args);
        };
        w.Intercom = i;
        var l = function() {
          var s = d.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = 'https://widget.intercom.io/widget/' + INTERCOM_APP_ID;
          var x = d.getElementsByTagName('script')[0];
          x.parentNode?.insertBefore(s, x);
        };
        l();
      }
    })();

    // Initialize Intercom
    window.Intercom('boot', {
      app_id: INTERCOM_APP_ID,
      ...(session?.user && {
        name: session.user.name,
        email: session.user.email,
        user_id: session.user.id,
      })
    });

    return () => {
      window.Intercom('shutdown');
    };
  }, [session]);

  return <>{children}</>;
}