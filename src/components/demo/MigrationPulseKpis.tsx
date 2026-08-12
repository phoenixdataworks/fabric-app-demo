import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import {
  migrationKpis,
  type MigrationKpi,
} from '@/lib/demo-report/migration-pulse-data';
import { cn } from '@/lib/utils';

const items: MigrationKpi[] = [
  migrationKpis.reportsMigrated,
  migrationKpis.activeUsers,
  migrationKpis.avgTimeToFind,
  migrationKpis.endorsementRate,
];

function formatKpiValue(kpi: MigrationKpi): string {
  if (kpi.format === 'percent') {
    return `${kpi.value}%`;
  }
  return kpi.value.toLocaleString();
}

function DeltaBadge({ delta, sentiment }: { delta: string; sentiment: MigrationKpi['sentiment'] }) {
  const positive = sentiment === 'up';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-200',
        positive ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      {positive ? (
        <ArrowUpRight className="size-3" aria-hidden />
      ) : (
        <ArrowDownRight className="size-3" aria-hidden />
      )}
      {delta}
    </span>
  );
}

export function MigrationPulseKpis() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((kpi, index) => (
        <div
          key={kpi.label}
          className="kpi-card rounded-lg border border-border bg-card p-4"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <p className="text-200 text-muted-foreground">{kpi.label}</p>
          <p className="mt-1 text-hero-700 font-semibold tabular-nums text-foreground">
            {formatKpiValue(kpi)}
          </p>
          <p className="mt-2">
            <DeltaBadge delta={kpi.delta} sentiment={kpi.sentiment} />
          </p>
        </div>
      ))}
    </div>
  );
}
