# Concepts

Short reference for attendees. Read this after the talk or while exploring the repo. For setup steps, start with **[GETTING_STARTED.md](GETTING_STARTED.md)**.

## Fabric Data Apps

Microsoft Fabric Data Apps are interactive React applications hosted inside Fabric. They connect to **semantic models** for governed read-only analytics. Use them when a classic Power BI report cannot carry the interaction you need: custom layouts, operational grids beside charts, or code-first UX.

This demo is **read-only**: charts and grids display data; nothing is written back.

## End-to-end data path

```text
Fabric Warehouse (Demo DW)
    → semantic model (Direct Lake on SQL from Reporting tab)
    → DAX (src/queries/migration-pulse/queries.ts)
    → @microsoft/fabric-visuals + @microsoft/fabric-datagrid
    → Migration Pulse page
```

There is **no committed-data fallback** in the UI. The warehouse seed file (`migration-pulse-data.ts`) exists only to generate bootstrap SQL.

## Data layers

| Layer | Location | Used on demo page? |
|-------|----------|--------------------|
| Schema Markdown | `schema/tables/` | Cursor grounding only |
| Warehouse SQL | `warehouse/migration-pulse.sql` | Loads Demo DW |
| Semantic model | Fabric portal (e.g. Demo SM) | DAX source |
| Live DAX + Vega | `src/queries/migration-pulse/` | **Yes** — KPIs, charts, grid |
| Seed rows | `src/lib/demo-report/migration-pulse-data.ts` | SQL generator only |

When you add a visual, keep column names consistent across schema Markdown, DAX queries, and Vega field names.

## Authentication

| Scenario | Auth required? |
|----------|----------------|
| `http://localhost:5173` alone | Data does not load — embed channel missing |
| Fabric App with `?fabricEmbedded=true&devUri=...` | **Yes** — Fabric host + `.env.fabric` |
| Published Fabric App (production) | **Yes** — same handshake |

Security for production read-only apps is enforced by:

1. **Fabric workspace permissions** — who can open the app item
2. **Semantic model RLS and roles** — what rows each user sees in DAX
3. **Fabric portal embedding** — token handshake via `@microsoft/fabric-app-data` and minimal Rayfin auth packages

## DAX and the semantic model

- Connection alias **`migrationPulse`** in `fabric.yaml` maps to your semantic model IDs.
- Dimension joins use **`LOOKUPVALUE`** so the model works even if you skip relationship setup in the model editor.
- Test queries locally with the `fabric-app-data` CLI after `az login`.

## Data Apps vs Power BI reports

| Choose a report when… | Choose a Data App when… |
|------------------------|-------------------------|
| Governed standard analytics | Custom UX on the same data |
| Report consumers only | Rich interaction and layout control |
| Power BI is the delivery surface | Code-first React + Fabric visuals |

Migration Pulse shows the second case: heatmap, donut, area, and an operational backlog grid on one page.

## Rules vs skills (Cursor)

| | Rules | Skills |
|---|--------|--------|
| Location | `.cursor/rules/*.mdc` | `.cursor/skills/<name>/SKILL.md` (project) or `~/.agents/skills/` / `~/.cursor/skills/` (global) |
| Role | Always-on invariants | Multi-step procedures |
| This repo | 3 rules | 1 project skill: `modify-fabric-data-app` |
| Official Fabric catalog | — | Install with `npx skills add microsoft/skills-for-fabric -a cursor -g -y` (see `docs/skills-for-fabric.md`) |

## Schema context (schema-scraper)

Commit Markdown from [schema-scraper on PyPI](https://pypi.org/project/schema-scraper/) under `schema/tables/`. Use it to give Cursor and other AI tools **ground truth** for warehouse columns when writing SQL, bootstrap scripts, or DAX — instead of inventing fields.

Fabric Git integration versions warehouse SQL and semantic model TMDL — valuable for ALM, but usually less LLM-friendly than structured Markdown. Best practice: use both. This demo shows the Markdown half plus warehouse bootstrap and live DAX.

Install: `pip install "schema-scraper[mssql]"` · Scrape: `npm run schema:scrape` · Details: `schema/README.md`

## Official skills vs this repo

Microsoft publishes [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) for warehouses, lakehouses, semantic models, PBIP, Git, and more. Install for Cursor with:

```bash
npx skills add microsoft/skills-for-fabric -a cursor -g -y
```

That catalog does **not** include a skill for modifying this React Fabric Data App layer. This repo ships `.cursor/skills/modify-fabric-data-app/` for that gap. See `docs/skills-for-fabric.md`.

## Honesty

Fabric Apps are still in preview. This demo requires a live semantic model and Fabric portal embed for data. See **GETTING_STARTED.md** for the full path.
