import type { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';

import { useThemeContext } from '@/hooks/theme.context';
import { cn } from '@/lib/utils';

interface PortalShellProps {
  children: ReactNode;
}

export function PortalShell({ children }: PortalShellProps) {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-200 font-medium uppercase tracking-wider text-muted-foreground">
              Fabric Data App Demo
            </p>
            <h1 className="text-hero-700 font-semibold text-foreground">
              Migration Pulse
            </h1>
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
