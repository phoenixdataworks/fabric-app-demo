import { ChartCard } from '@/components/demo/ChartCard';
import { LiveDataGrid } from '@/components/demo/LiveDataGrid';
import { LiveVegaChart } from '@/components/demo/LiveVegaChart';
import { MigrationPulseKpis } from '@/components/demo/MigrationPulseKpis';
import { PortalShell } from '@/components/layout/PortalShell';
import { SEMANTIC_MODEL_NAME } from '@/config/semantic-model';
import {
  adoptionTrendColumnMetadata,
  adoptionTrendQuery,
  adoptionTrendVegaSpec,
  backlogColumnMetadata,
  backlogQuery,
  channelMixColumnMetadata,
  channelMixQuery,
  reportMixVegaSpec,
  teamReadinessColumnMetadata,
  teamReadinessQuery,
  teamReadinessVegaSpec,
} from '@/queries/migration-pulse';

export function MigrationPulsePage() {
  return (
    <PortalShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="max-w-2xl text-400 text-muted-foreground">
            Read-only Fabric Data App on semantic model {SEMANTIC_MODEL_NAME} (Demo DW warehouse).
            Built with React + Fabric Vega visuals — no Power BI embed required.
          </p>
        </div>
        <p className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-200 text-muted-foreground">
          Live semantic model · {SEMANTIC_MODEL_NAME}
        </p>
      </div>

      <MigrationPulseKpis />

      <div className="mt-6 grid gap-4 lg:grid-cols-5 lg:items-stretch">
        <div className="lg:col-span-3 lg:min-h-[340px]">
          <ChartCard
            title="Adoption trend"
            subtitle="Legacy MSSQL reports declining as Snowflake-backed Power BI grows"
            minHeight={320}
          >
            <LiveVegaChart
              query={adoptionTrendQuery}
              columnMetadata={adoptionTrendColumnMetadata}
              spec={adoptionTrendVegaSpec}
              minHeight={320}
            />
          </ChartCard>
        </div>
        <div className="lg:col-span-2 lg:min-h-[340px]">
          <ChartCard
            title="Channel mix"
            subtitle="Where users spend time today"
            minHeight={320}
          >
            <LiveVegaChart
              query={channelMixQuery}
              columnMetadata={channelMixColumnMetadata}
              spec={reportMixVegaSpec}
              minHeight={320}
            />
          </ChartCard>
        </div>
      </div>

      <div className="mt-4 min-h-[300px]">
        <ChartCard
          title="Team readiness heatmap"
          subtitle="Weekly migration readiness score by business domain"
          minHeight={280}
        >
          <LiveVegaChart
            query={teamReadinessQuery}
            columnMetadata={teamReadinessColumnMetadata}
            spec={teamReadinessVegaSpec}
            minHeight={280}
          />
        </ChartCard>
      </div>

      <div className="mt-4">
        <ChartCard
          title="Migration backlog"
          subtitle="Sortable grid — typical operational view not available in standard Power BI tiles"
          minHeight={260}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-auto">
            <LiveDataGrid
              query={backlogQuery}
              columnMetadata={backlogColumnMetadata}
              minHeight={220}
            />
          </div>
        </ChartCard>
      </div>
    </PortalShell>
  );
}
