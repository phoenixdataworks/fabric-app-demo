import type { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';

import { useThemeContext } from '@/hooks/theme.context';
import { cn } from '@/lib/utils';

interface PortalShellProps {
  children: ReactNode;
}

const LOGO_FOR_LIGHT_THEME = '/logo-no-background.png';
const LOGO_FOR_DARK_THEME = '/logo-white-no-background.png';

export function PortalShell({ children }: PortalShellProps) {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <img
              src={isDark ? LOGO_FOR_DARK_THEME : LOGO_FOR_LIGHT_THEME}
              alt="Company logo"
              className="h-10 w-auto shrink-0"
            />
            <div>
              <p className="text-200 font-medium uppercase tracking-wider text-muted-foreground">
                Fabric Data App Demo
              </p>
              <h1 className="text-hero-700 font-semibold text-foreground">
                Migration Pulse
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              'inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-300',
              'hover:bg-accent',
            )}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? (
              <Sun className="size-4" aria-hidden />
            ) : (
              <Moon className="size-4" aria-hidden />
            )}
            Theme
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
