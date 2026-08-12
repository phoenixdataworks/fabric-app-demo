import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  minHeight?: number;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  minHeight = 300,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        'flex h-full flex-col overflow-visible rounded-lg border border-border bg-card',
        className,
      )}
    >
      <header className="border-b border-border px-4 py-3">
        <h3 className="text-400 font-semibold text-card-foreground">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-300 text-muted-foreground">{subtitle}</p>
        )}
      </header>
      <div
        className="flex flex-1 min-h-0 flex-col overflow-visible p-3"
        style={{ minHeight }}
      >
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-visible">
          {children}
        </div>
      </div>
    </section>
  );
}
