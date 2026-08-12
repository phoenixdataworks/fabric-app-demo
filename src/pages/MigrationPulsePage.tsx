import { VegaVisual, useCssTheme } from '@microsoft/fabric-visuals';
import { DataGrid } from '@microsoft/fabric-datagrid';

import { ChartCard } from '@/components/demo/ChartCard';
import { MigrationPulseKpis } from '@/components/demo/MigrationPulseKpis';
import { PortalShell } from '@/components/layout/PortalShell';
import {
  adoptionTrendTable,
  backlogTable,
  reportMixTable,
  teamReadinessTable,
} from '@/lib/demo-report/migration-pulse-data';
import {
  adoptionTrendVegaSpec,
  backlogByRiskVegaSpec,
  reportMixVegaSpec,
  teamReadinessVegaSpec,
} from '@/queries/migration-pulse';

export function MigrationPulsePage() {
  const theme = useCssTheme();

  return (
    <PortalShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="max-w-2xl text-400 text-muted-foreground">
            Interactive Fabric Data App on top of a semantic-model-shaped dataset.
            Built with React + Fabric Vega visuals — no Power BI embed required.
          </p>
        </div>
        <p className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-200 text-muted-foreground">
          Demo data · not connected to a live semantic model
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
            <VegaVisual
              spec={adoptionTrendVegaSpec}
              data={adoptionTrendTable}
              theme={theme}
            />
          </ChartCard>
        </div>
        <div className="lg:col-span-2 lg:min-h-[340px]">
          <ChartCard
            title="Channel mix"
            subtitle="Where users spend time today"
            minHeight={320}
          >
            <VegaVisual
              spec={reportMixVegaSpec}
              data={reportMixTable}
              theme={theme}
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
          <VegaVisual
            spec={teamReadinessVegaSpec}
            data={teamReadinessTable}
            theme={theme}
          />
        </ChartCard>
      </div>

      <div className="mt-4">
        <ChartCard
          title="Backlog by risk"
          subtitle="Count of in-flight reports by risk — from fact_migration_backlog.risk"
          minHeight={240}
        >
          <VegaVisual
            spec={backlogByRiskVegaSpec}
            data={backlogTable}
            theme={theme}
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
            <DataGrid data={backlogTable} theme={theme} />
          </div>
        </ChartCard>
      </div>
    </PortalShell>
  );
}
