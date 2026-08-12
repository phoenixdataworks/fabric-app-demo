# Live demo: Backlog by risk

**Duration target:** 12 minutes  
**Starting state:** `master` has no "Backlog by risk" chart.

**Prerequisite:** Attendees completed **[GETTING_STARTED.md](../GETTING_STARTED.md)** — semantic model, Fabric App, and portal embed working.

## On-stage prompt

Copy into Cursor Agent (with this repo and the skill in context):

```text
Use the modify-fabric-data-app skill.

Add a Vega bar chart titled "Backlog by risk" to Migration Pulse.
Use only columns from schema/tables/fact_migration_backlog.md.
Add DAX in migration-pulse-live/queries.ts that counts reports by risk.
Wire with LiveVegaChart (not demo tables).
Place the chart above the Migration backlog grid.
Do not invent columns. Do not change auth or routing.
```

## Verification

```bash
npm test
npm run dev
```

Open the Fabric App with `?fabricEmbedded=true&devUri=http://localhost:5173`. Confirm the new chart loads from DAX and the **Live semantic model** badge still appears.

## Fallback (paste if Cursor fails)

### 1. Add to `src/queries/migration-pulse-live/queries.ts`

```ts
export const backlogByRiskQuery = `
EVALUATE
SUMMARIZECOLUMNS(
    fact_migration_backlog[risk],
    "count", COUNTROWS(fact_migration_backlog)
)
`.trim();

export const backlogByRiskColumnMetadata = {
  'fact_migration_backlog[risk]': { name: 'risk', displayName: 'Risk' },
  count: { name: 'count', displayName: 'Reports', format: '#,0' },
} as const;
```

(Adjust metadata keys if the CLI returns bracketed names — see `to-data-table.ts`.)

### 2. Create `src/queries/migration-pulse/backlog-by-risk.json`

Use the Vega spec from the previous fallback in git history, or a simple bar chart on `risk` and `count`.

### 3. Wire in `MigrationPulsePage.tsx`

```tsx
<LiveVegaChart
  query={backlogByRiskQuery}
  columnMetadata={backlogByRiskColumnMetadata}
  spec={backlogByRiskVegaSpec}
  minHeight={240}
/>
```

Test DAX:

```bash
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js query migrationPulse \
  --query "EVALUATE SUMMARIZECOLUMNS(fact_migration_backlog[risk], \"count\", COUNTROWS(fact_migration_backlog))"
```
