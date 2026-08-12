import { QueryState } from '@/components/demo/QueryState';
import { useSemanticModelQuery } from '@/hooks/use-semantic-model-query';
import { toDataTable } from '@/lib/to-data-table';
import {
  kpiColumnMetadata,
  kpiQuery,
  SEMANTIC_MODEL_CONNECTION,
} from '@/queries/migration-pulse/queries';

const KPI_ITEMS = [
  { field: 'reportsOnSnowflake', label: 'Reports on Snowflake' },
  { field: 'legacyMssql', label: 'Legacy MSSQL reports' },
  { field: 'backlogCount', label: 'Open backlog items' },
  { field: 'avgReadiness', label: 'Avg readiness score' },
] as const;

function formatKpiValue(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString();
  }
  return '—';
}

export function MigrationPulseKpis() {
  const { data, isLoading, error } = useSemanticModelQuery({
    connection: SEMANTIC_MODEL_CONNECTION,
    query: kpiQuery,
  });

  const row =
    data?.status === 'success'
      ? toDataTable(data.table, kpiColumnMetadata).rows[0]
      : undefined;

  return (
    <QueryState isLoading={isLoading} error={error} minHeight={96}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_ITEMS.map((kpi, index) => {
          const value = row?.[index];
          return (
            <div
              key={kpi.field}
              className="kpi-card rounded-lg border border-border bg-card p-4"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <p className="text-200 text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-hero-700 font-semibold tabular-nums text-foreground">
                {formatKpiValue(value)}
              </p>
            </div>
          );
        })}
      </div>
    </QueryState>
  );
}
