import { ErrorBoundary } from 'react-error-boundary';

import App from './App';
import { ErrorFallback } from './ErrorFallback';
import { AuthProvider } from './hooks/use-auth';
import { useAppTheme } from './hooks/use-theme';
import { ThemeContext } from './hooks/theme.context';

export function AppRoot() {
  const { isDark, toggleTheme } = useAppTheme();

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <AuthProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <App />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}
