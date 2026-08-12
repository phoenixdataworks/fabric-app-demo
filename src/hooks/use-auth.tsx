import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { initEmbeddedAuth } from '@microsoft/rayfin-auth-provider-fabric';

import { getFabricAuthOptions } from '@/lib/fabric-auth';
import { getRayfinClient } from '@/lib/rayfin-client';

import { AuthContext, type AuthContextValue } from './auth.context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthContextValue['session']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const client = getRayfinClient();
        const options = getFabricAuthOptions();
        const result = await initEmbeddedAuth(client.auth, options);
        if (!cancelled) {
          setSession(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session?.isAuthenticated ?? false,
      isLoading,
      error,
    }),
    [session, isLoading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
