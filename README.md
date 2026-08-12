# Fabric Data App Demo

Public teaching repo for **Build Microsoft Fabric Data Apps with Cursor** (Arizona Data Platform Users Group).

**Migration Pulse** is a read-only dashboard: KPIs, Vega area/donut/heatmap charts, and a sortable backlog grid. All visuals query a **live semantic model** over a Fabric **Warehouse** via DAX. There is **no offline demo mode**.

---

## Start here

**New clone?** Follow **[docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)** end to end.

Short checklist:

```bash
npm install
npm run warehouse:sql -- --demo          # generate SQL → run in Demo DW
# Create semantic model from Demo DW → Reporting → New semantic model
cp fabric.yaml.example fabric.yaml       # semantic model IDs under semanticModels:
npm run fabric:generate
cp .env.fabric.example .env.fabric       # Fabric App env (incl. publishable key)
npm run dev
# Open Fabric App in portal: ?fabricEmbedded=true&devUri=http://localhost:5173
```

Localhost alone does not load data. The Fabric portal provides auth and the DAX embed channel.

---

## Architecture

```text
Demo DW warehouse  →  semantic model (e.g. Demo SM)  →  DAX  →  React + Fabric visuals
```

| Path | Role |
|------|------|
| [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) | Full setup checklist |
| [docs/wire-semantic-model.md](docs/wire-semantic-model.md) | Wiring reference |
| [docs/CONCEPTS.md](docs/CONCEPTS.md) | Data layers, auth, vs Power BI |
| [docs/changes/](docs/changes/) | Product and technical change log |
| `src/queries/migration-pulse/queries.ts` | DAX + column metadata |
| `src/queries/migration-pulse/*.json` | Vega-Lite specs |
| `warehouse/migration-pulse.sql` | Warehouse bootstrap |
| `schema/tables/` | Schema context for Cursor ([schema-scraper](https://pypi.org/project/schema-scraper/)) |
| `.cursor/skills/modify-fabric-data-app/` | Safe page change procedure |

---

## Data layers

| Layer | Location | Used by UI? |
|-------|----------|-------------|
| Warehouse SQL | `warehouse/` | Source data in Fabric |
| Semantic model | Fabric portal (your item) | DAX target |
| Live DAX + Vega | `src/queries/migration-pulse/` | **Yes** |
| Seed rows | `src/lib/demo-report/migration-pulse-data.ts` | SQL generator only |
| Schema Markdown | `schema/tables/` | Cursor grounding |

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (loads `.env.fabric` via `predev`) |
| `npm run fabric:generate` | `fabric.yaml` → `src/fabric.generated.ts` |
| `npm run warehouse:sql -- --demo` | Generate warehouse bootstrap SQL |
| `npm run schema:scrape` | Refresh `schema/tables/` via [schema-scraper](https://pypi.org/project/schema-scraper/) |
| `npm test` | Vitest (mocks DAX) |
| `npm run skills:list` | List project-scoped Cursor skills |
| `npm run skills:list:global` | List global Cursor skills |

---

## Talk

- [Agenda](docs/talk/agenda.md) — 60-minute rundown
- [Speaking notes](docs/talk/speaking-notes.md)
- [Live exercise](docs/talk/live-demo.md) — or ask Cursor to use the `modify-fabric-data-app` skill

---

## Optional: official Fabric skills

Install Microsoft's [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) catalog with the [skills CLI](https://github.com/vercel-labs/skills):

```bash
# Global (recommended — full catalog in every project)
npx skills add microsoft/skills-for-fabric -a cursor -g -y

# Project-scoped (commit .agents/skills/ or .cursor/skills/ for the team)
npx skills add microsoft/skills-for-fabric -a cursor -y
```

After install, open a new Cursor chat. List installed skills: `npx skills list -g`.

Full scope options and bundles: [docs/skills-for-fabric.md](docs/skills-for-fabric.md).

---

## License

MIT. App shell derived from the Microsoft Fabric Data Apps template. Teaching artifacts by Phoenix DataWorks LLC.
