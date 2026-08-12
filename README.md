# Fabric Data App Demo

Public teaching repo for **Build Microsoft Fabric Data Apps with Cursor** (Arizona Data Platform Users Group).

The home page is **Migration Pulse**: KPIs plus Vega area, donut, heatmap, and a backlog grid. Data is committed demo tables so you can run without Fabric credentials.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## What to inspect

| Path | Why it exists |
|------|----------------|
| `src/pages/MigrationPulsePage.tsx` | The unique visualization |
| `schema/` | schema_scraper-style Markdown Cursor must obey |
| `.cursor/rules/` | Always-on constraints (stack, schema grounding, no-edit zones) |
| `.cursor/skills/modify-fabric-data-app/` | One repeatable modification procedure for this app |
| `docs/CONCEPTS.md` | Rules vs skills vs schema vs Rayfin vs Power BI |
| `docs/skills-for-fabric.md` | Official Microsoft Fabric skills catalog + install |
| `docs/talk/live-demo.md` | 15-minute exercise: add backlog-by-risk |
| `rayfin/data/` | TypeScript models Rayfin uses to generate APIs and hosting |

## Live exercise

`main` does **not** include a "Backlog by risk" chart on purpose. Follow `docs/talk/live-demo.md` (or ask Cursor to use the `modify-fabric-data-app` skill).

## Official Fabric skills (install + show)

Microsoft's platform catalog lives in [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric). Install it beside this repo:

```bash
npm run skills:install
```

Then in Cursor: **File → Add Folder to Workspace** and select the cloned `skills-for-fabric` folder. Official `.cursorrules` and dozens of skills apply to warehouse, lakehouse, semantic model, and PBIP work. This repo's one skill covers the Rayfin Data App layer.

See `docs/skills-for-fabric.md` for bundles, what it covers, and the gap this demo fills.

## Deploy to Fabric (optional)

Requires a Fabric workspace and Rayfin login. Not needed to learn from this repo.

```bash
npx rayfin login
npx rayfin up
npm run dev:fabric
```

## License

MIT. App shell derived from the Microsoft Fabric Data Apps template. Teaching artifacts by Phoenix DataWorks LLC.
