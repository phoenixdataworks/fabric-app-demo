# Live demo: Backlog by risk

**Duration target:** 12 minutes  
**Starting state:** `master` has no "Backlog by risk" chart.

**Prerequisite:** Attendees completed **[GETTING_STARTED.md](../GETTING_STARTED.md)** — Demo DW loaded, semantic model, Fabric App, and portal embed working.

## Data path (say this once)

```text
Demo DW (Fabric Warehouse)
    → schema-scraper → schema/tables/*.md   (Cursor grounding)
    → semantic model (Reporting tab)        (DAX target)
    → src/queries/migration-pulse/queries.ts       (DAX in the app)
    → LiveVegaChart                         (live data in the UI)
```

The app never reads `schema/tables/` at runtime. Those files are **warehouse metadata scraped into the repo** so Cursor does not invent column names. Charts and grids load only from DAX against your semantic model over Demo DW.

## Before you go on stage

Confirm the warehouse path is live (not just committed files in git):

```bash
# 1. Demo DW has the six Migration Pulse tables (run SQL in portal if needed)
npm run warehouse:sql -- --demo

# 2. Refresh schema Markdown from Demo DW (once per machine, or when tables change)
pip install "schema-scraper[mssql]"   # https://pypi.org/project/schema-scraper/
cp .env.warehouse.example .env.warehouse   # fill SQL endpoint + tenant
az login --tenant YOUR-TENANT-GUID --allow-no-subscriptions
npm run schema:scrape

# 3. Semantic model + portal embed still work
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js query migrationPulse \
  --query "EVALUATE TOPN(3, fact_migration_backlog)"
```

Open the Fabric App with `?fabricEmbedded=true&devUri=http://localhost:5173` before the live segment.

---

## On-stage prompt

Copy into Cursor Agent (with this repo and the skill in context):

```text
Use the modify-fabric-data-app skill.

Add a Vega bar chart titled "Backlog by risk" to Migration Pulse.
Ground on Demo DW table fact_migration_backlog — read schema/tables/fact_migration_backlog.md
(scraped from the Fabric Warehouse; do not invent columns).
Add DAX in src/queries/migration-pulse/queries.ts that counts reports by risk.
Wire with LiveVegaChart so data comes from the live semantic model over Demo DW (not demo tables or committed chart data).
Place the chart above the Migration backlog grid.
Do not change auth or routing.
```

## While it runs (narration)

1. Schema Markdown came from **schema-scraper** against Demo DW — ground truth for SQL and DAX.
2. DAX in `queries.ts` runs against the **semantic model**; the model reads the warehouse.
3. Vega JSON is layout only. **LiveVegaChart** fetches rows at runtime through the Fabric portal embed.

## Verification

```bash
npm test
npm run dev
```

Open the Fabric App with `?fabricEmbedded=true&devUri=http://localhost:5173`. Confirm the new chart loads from DAX and the **Live semantic model** badge still appears.

## Fallback (paste if Cursor fails)

### 1. Add to `src/queries/src/queries/migration-pulse/queries.ts`

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

Test DAX against Demo DW via the semantic model:

```bash
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js query migrationPulse \
  --query "EVALUATE SUMMARIZECOLUMNS(fact_migration_backlog[risk], \"count\", COUNTROWS(fact_migration_backlog))"
```
