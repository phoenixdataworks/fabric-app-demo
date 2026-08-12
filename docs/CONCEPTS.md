# Concepts

Short reference for attendees. Read this after the talk or while exploring the repo.

## Fabric Data Apps

Microsoft Fabric Data Apps are interactive applications hosted as first-class items inside Fabric. They connect to semantic models, warehouses, and Rayfin-backed entities. Use them when a classic Power BI report cannot carry the interaction you need: custom layouts, write-back, embedded logic, or operational grids beside charts.

## Rayfin

Rayfin is the open-source SDK and CLI that powers Fabric Apps. You define data models in TypeScript with decorators; Rayfin generates APIs, handles authentication, provides hosting, and deploys the app. Inspect `rayfin/data/` in this repo for examples. The demo page reads committed tables in `src/lib/demo-report/` so clone-and-run works without Fabric login.

## Data layers

| Layer | Location | Used on demo page? |
|-------|----------|--------------------|
| Schema Markdown | `schema/tables/` | Cursor grounding only |
| Demo tables | `src/lib/demo-report/migration-pulse-data.ts` | Yes |
| Rayfin entities | `rayfin/data/` | Deploy / API generation |

When you add a visual, keep column names consistent across all three where they overlap.

## Data Apps vs Power BI reports

| Choose a report when… | Choose a Data App when… |
|------------------------|-------------------------|
| Governed paginated or standard analytics | Custom UX on the same data |
| Report consumers only | Interaction, filters, write-back |
| Power BI is the delivery surface | Code-first React + Fabric visuals |

Migration Pulse shows the second case: heatmap, donut, area, and an operational backlog grid on one page.

## Rules vs skills (Cursor)

| | Rules | Skills |
|---|--------|--------|
| Location | `.cursor/rules/*.mdc` | `.cursor/skills/<name>/SKILL.md` |
| Role | Always-on invariants | Multi-step procedures |
| This repo | 3 rules | 1 skill: `modify-fabric-data-app` |

Rules say what must never happen (invent columns, edit secrets). Skills say how to complete a repeatable task safely.

## Schema context

Commit schema_scraper Markdown under `schema/`. Point rules at it. Fabric Git integration versions warehouse `.sql` and semantic model TMDL — valuable for ALM, but usually less LLM-friendly than structured Markdown. Best practice: use both. This demo shows the Markdown half.

## Official skills vs this repo

Microsoft publishes [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) for warehouses, lakehouses, semantic models, PBIP, Git, and more. Install with `npm run skills:install` and add that folder to your Cursor workspace.

That catalog does **not** include a skill for modifying Rayfin TypeScript Data Apps. That gap is why this repo ships one custom skill. See `docs/skills-for-fabric.md` for details.

## Honesty

Fabric Apps are still in preview. This demo uses committed data so the talk and clone path stay reliable. A production app would use `useSemanticModelQuery` and DAX against a live semantic model. Reference scaffolding for that path lives in `docs/examples/live-dax/` (copied from the Microsoft template this app was slimmed from).
