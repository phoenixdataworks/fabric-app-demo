import { createContext, useContext } from 'react';
import type { OpaqueSession } from '@microsoft/rayfin-auth';

export interface AuthContextValue {
  session: OpaqueSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextValue>({
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
