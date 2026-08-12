# Live demo: Backlog by risk

**Duration target:** 12 minutes  
**Starting state:** `master` has no "Backlog by risk" chart.

## On-stage prompt

Copy into Cursor Agent (with this repo and the skill in context):

```text
Use the modify-fabric-data-app skill.

Add a Vega bar chart titled "Backlog by risk" to Migration Pulse.
Use only columns from schema/tables/fact_migration_backlog.md.
Aggregate the existing backlogTable rows by the risk column.
Place the chart above the Migration backlog grid.
Do not invent columns. Do not change auth or routing.
```

## Verification

```bash
npm test
npm run dev
```

Confirm `/` shows the new chart and the demo-data banner still appears.

## Fallback (paste if Cursor fails)

### 1. Create `src/queries/migration-pulse/backlog-by-risk.json`

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": "container",
  "data": { "name": "source" },
  "mark": { "type": "bar" },
  "encoding": {
    "x": {
      "field": "risk",
      "type": "nominal",
      "sort": ["Low", "Medium", "High"],
      "title": "Risk"
    },
    "y": {
      "aggregate": "count",
      "type": "quantitative",
      "title": "Reports"
    },
    "color": {
      "field": "risk",
      "type": "nominal",
      "scale": {
        "domain": ["Low", "Medium", "High"],
        "range": ["#2d8a6f", "#c4a35a", "#c50f1f"]
      },
      "legend": null
    },
    "tooltip": [
      { "field": "risk", "type": "nominal" },
      { "aggregate": "count", "type": "quantitative", "title": "Reports" }
    ]
  },
  "view": { "stroke": null }
}
```

### 2. Update `src/queries/migration-pulse/index.ts`

Add:

```ts
import backlogByRiskSpec from './backlog-by-risk.json';

export const backlogByRiskVegaSpec = backlogByRiskSpec as VisualizationSpec;
```

### 3. Insert in `src/pages/MigrationPulsePage.tsx` (above Migration backlog)

```tsx
<ChartCard
  title="Backlog by risk"
  subtitle="Count of in-flight reports by risk — from fact_migration_backlog.risk"
  minHeight={240}
>
  <VegaVisual spec={backlogByRiskVegaSpec} data={backlogTable} theme={theme} />
</ChartCard>
```

Import `backlogByRiskVegaSpec` from `@/queries/migration-pulse`.
