---
name: modify-fabric-data-app
description: Safely modify this Fabric Data App using schema Markdown and live DAX queries. Use when adding or changing a visual, KPI, or grid on Migration Pulse.
---

# Modify Fabric Data App

## When to use

The user wants a small, reviewable change to the Migration Pulse page (new chart, KPI, or grid column) while staying aligned with `schema/` and live DAX.

**Prerequisite:** Semantic model and Fabric App are wired per `docs/GETTING_STARTED.md`.

**Related:** Official Microsoft Fabric platform skills install separately — see `docs/skills-for-fabric.md`. This skill covers only the React Data App layer in this repo.

## Required context

Read before editing:

1. `docs/GETTING_STARTED.md` (if setup context is unclear)
2. `schema/README.md` and the relevant `schema/tables/*.md`
3. `src/queries/migration-pulse-live/queries.ts` (DAX + column metadata)
4. `src/queries/migration-pulse/` (Vega specs)
5. `src/pages/MigrationPulsePage.tsx`
6. `src/lib/demo-report/migration-pulse-data.ts` (warehouse seed rows only — update when bootstrap SQL must change)
7. `.cursor/rules/schema-grounding.mdc`

## Steps

1. Identify the visual and the warehouse / semantic model tables it uses.
2. Confirm every field exists in schema Markdown. If not, stop.
3. Add or update DAX in `migration-pulse-live/queries.ts`. Use `LOOKUPVALUE` for dimension labels unless the model has relationships and you prefer `RELATED`.
4. Add column metadata keys that match Vega field names (`month`, `channel`, `risk`, etc.). DAX may return bracketed names — `to-data-table.ts` normalizes them.
5. Add a Vega-Lite JSON in `src/queries/migration-pulse/` when adding a chart. For donuts in narrow cards: bottom legend, no fixed `outerRadius`.
6. Export the spec from `src/queries/migration-pulse/index.ts`.
7. Wire `ChartCard` + `LiveVegaChart` or `LiveDataGrid` in `MigrationPulsePage.tsx`.
8. Do not change auth, routing, or branding unless asked.
9. Add a change doc under `docs/changes/` (see `docs/changes/README.md`). Cover product and technical impact.
10. Run the completion checklist in `.cursor/rules/change-completion.mdc` before marking the change done.

## Verification

Follow `.cursor/rules/change-completion.mdc`:

- `npm run verify` (lint + test + build)
- Test DAX: `node node_modules/@microsoft/fabric-app-data-cli/dist/index.js query migrationPulse --query "..."`
- `npm run dev` — confirm the visual in the **Fabric App** embed (`fabricEmbedded=true`)
- Thermo-nuclear code quality review via `thermo-nuclear-code-quality-review-subagent`

## Avoid

- Inventing columns not in `schema/`
- Offline demo tables or `VegaVisual` with committed data — use `LiveVegaChart` / `LiveDataGrid`
- Wrong `fabric.yaml` shape (`connections:`) — use `semanticModels:`
- Large refactors, auth changes, catalog, admin, or Power BI embed
