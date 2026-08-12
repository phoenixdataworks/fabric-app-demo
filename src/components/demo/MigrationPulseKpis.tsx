import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { migrationKpis } from '@/lib/demo-report/migration-pulse-data';
import { cn } from '@/lib/utils';

const items = [
  migrationKpis.reportsMigrated,
  migrationKpis.activeUsers,
  migrationKpis.avgTimeToFind,
  migrationKpis.endorsementRate,
] as const;

function DeltaBadge({ delta }: { delta: string }) {
  const positive = delta.startsWith('+') || delta.startsWith('−18');
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
      {items.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
          className="rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <p className="text-200 text-muted-foreground">{kpi.label}</p>
          <p className="mt-1 text-hero-700 font-semibold tabular-nums text-foreground">
            {kpi.label.includes('%') ? `${kpi.value}%` : kpi.value.toLocaleString()}
          </p>
          <p className="mt-2">
            <DeltaBadge delta={kpi.delta} />
          </p>
        </motion.div>
      ))}
    </div>
  );
}
