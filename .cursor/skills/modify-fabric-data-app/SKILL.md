---
name: modify-fabric-data-app
description: Safely modify this Fabric Data App using schema Markdown and the connected demo tables. Use when adding or changing a visual, KPI, or grid on Migration Pulse.
---

# Modify Fabric Data App

## When to use

The user wants a small, reviewable change to the existing Migration Pulse page (new chart, KPI, or grid column) while staying aligned with `schema/` and the demo tables.

## Required context

Read before editing:

1. `schema/README.md` and the relevant `schema/tables/*.md`
2. `src/lib/demo-report/migration-pulse-data.ts`
3. `src/pages/MigrationPulsePage.tsx`
4. `src/queries/migration-pulse/`
5. `.cursor/rules/schema-grounding.mdc`

## Steps

1. Identify the requested visual and the schema table it uses.
2. Confirm every field exists in schema Markdown. If not, stop.
3. Reuse existing demo tables when the data is already in `migration-pulse-data.ts`. Do not invent rows.
4. Add a Vega-Lite spec JSON next to the other specs in `src/queries/migration-pulse/` when adding a chart.
5. Export the spec from `src/queries/migration-pulse/index.ts`.
6. Wire a `ChartCard` + `VegaVisual` (or DataGrid) into `MigrationPulsePage.tsx`.
7. Do not change auth, Rayfin models, routing, or branding unless asked.

## Verification

- `npm test`
- `npm run dev` — confirm `/` still loads and the new visual is visible
- Confirm the new visual title is specific (not "Chart")

## Avoid

- Inventing columns not in `schema/`
- Large refactors
- Changing auth or deploy config
- Adding catalog, admin, or Power BI embed
- Connecting to a live semantic model unless the user explicitly asks and `fabric.yaml` already has a connection
