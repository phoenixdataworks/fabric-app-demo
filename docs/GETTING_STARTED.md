# Getting started

This repo is a **read-only Fabric Data App** that queries a **live semantic model** over a Fabric **Warehouse**. There is **no offline demo mode** — every chart, KPI, and grid runs DAX through the Fabric portal auth handshake.

Follow these steps in order the first time you clone the repo.

---

## What you are building

```text
warehouse/migration-pulse.sql     →  tables in Demo DW (Fabric Warehouse)
        ↓
Semantic model (e.g. "Demo SM")   →  published from the warehouse Reporting tab
        ↓
fabric.yaml + fabric:generate     →  src/fabric.generated.ts (connection IDs)
        ↓
.env.fabric                       →  Fabric App auth env vars
        ↓
npm run dev + Fabric portal       →  Migration Pulse page with live DAX
```

| Layer | File / location | Purpose |
|-------|-----------------|--------|
| Warehouse SQL | `warehouse/migration-pulse.sql` | Create and load six tables in Demo DW |
| Schema docs | `schema/tables/*.md` | Cursor grounding (scrape from warehouse) |
| Seed row source | `src/lib/demo-report/migration-pulse-data.ts` | **SQL generator only** — not used by the UI |
| DAX queries | `src/queries/migration-pulse-live/queries.ts` | What the app executes |
| Vega specs | `src/queries/migration-pulse/*.json` | Chart layout only |
| Connection config | `fabric.yaml` → `src/fabric.generated.ts` | Semantic model workspace + item IDs |
| Portal auth | `.env.fabric` | Fabric App item IDs and publishable key |

---

## Prerequisites

- Node.js 20+ and `npm install` in this repo
- A Fabric workspace with a **Warehouse** named **Demo DW** (or your own; update docs accordingly)
- Permission to create a **semantic model** and a **Fabric App** item in that workspace
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) for optional schema scrape (`az login`)
- Tenant setting: **Semantic Model Execute Queries REST API** enabled (Fabric admin)

---

## Step 1 — Load the warehouse

Generate bootstrap SQL (committed demo rows):

```bash
npm run warehouse:sql -- --demo
```

In the Fabric portal, open **Demo DW** → **SQL query** (or your SQL editor) and run:

- `warehouse/migration-pulse.sql`

Tables created:

| Table | Role |
|-------|------|
| `dim_team`, `dim_channel` | Dimensions |
| `fact_report_adoption` | Monthly MSSQL vs Snowflake counts |
| `fact_channel_mix` | Reports per channel |
| `fact_team_readiness` | Weekly readiness scores |
| `fact_migration_backlog` | In-flight migrations |

Optional — refresh schema Markdown from the live warehouse:

```bash
cp .env.warehouse.example .env.warehouse   # fill SQL endpoint + tenant
az login --tenant YOUR-TENANT-GUID --allow-no-subscriptions
npm run schema:scrape
```

See `warehouse/README.md` and `schema/README.md`.

---

## Step 2 — Create a semantic model

**Do not** use workspace **New item → Semantic model** (that path is for OneLake / lakehouse).

1. Open the **Demo DW** warehouse item.
2. **Reporting** tab → **New semantic model**.
3. Name it (e.g. **Demo SM**).
4. Select all six tables listed above → **Confirm**.
5. **Save** the model.

Relationships in the model editor are **optional**. DAX in this repo uses `LOOKUPVALUE` to join dimensions when relationships are missing. Adding relationships later is fine but not required.

Official reference: [Create a semantic model from a warehouse](https://learn.microsoft.com/en-us/fabric/data-warehouse/create-semantic-model).

Copy the **workspace ID** and **semantic model item ID** from the model URL:

```text
https://app.fabric.microsoft.com/groups/{workspaceId}/semanticModels/{semanticModelId}/...
```

---

## Step 3 — Register the connection in this repo

```bash
cp fabric.yaml.example fabric.yaml
```

Edit `fabric.yaml`. Use the **`semanticModels`** group (not `connections`):

```yaml
activeProfile: default
profiles:
  default:
    semanticModels:
      migrationPulse:
        workspaceId: YOUR-WORKSPACE-GUID
        itemId: YOUR-SEMANTIC-MODEL-GUID
```

- **`migrationPulse`** is a code alias only. Your Fabric item can be named **Demo SM** or anything else.
- Display name in the UI is set in `src/config/semantic-model.ts` (`SEMANTIC_MODEL_NAME`).

Generate TypeScript config:

```bash
npm run fabric:generate
```

Confirm `src/fabric.generated.ts` contains your GUIDs (not placeholders).

Test DAX from the terminal (requires `az login`):

```bash
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js query migrationPulse \
  --query "EVALUATE fact_report_adoption"
```

---

## Step 4 — Create a Fabric App item

1. In the workspace: **New item** → **App** (Fabric Data App).
2. From the App item **Settings**, copy:
   - Workspace ID
   - **App item ID** (not the semantic model ID)
   - Backend URL → `VITE_RAYFIN_BASE_URL`
   - **Publishable key** → `VITE_RAYFIN_PUBLISHABLE_KEY` (`pk-...`)

```bash
cp .env.fabric.example .env.fabric
# fill all VITE_* values
```

| Variable | Source |
|----------|--------|
| `VITE_FABRIC_WORKSPACE_ID` | Workspace GUID |
| `VITE_FABRIC_ITEM_ID` | **Fabric App** item GUID |
| `VITE_FABRIC_PORTAL_URL` | `https://app.fabric.microsoft.com/` |
| `VITE_RAYFIN_BASE_URL` | App backend URL from portal |
| `VITE_RAYFIN_PUBLISHABLE_KEY` | App publishable key from portal |

Grant your account **Read** and **Build** on the semantic model.

---

## Step 5 — Run the app

```bash
npm install
npm run dev
```

`predev` copies `.env.fabric` → `.env.development.local` so Vite loads your env vars.

Open the **Fabric App** item in the portal (not the semantic model). Append to the URL:

```text
?fabricEmbedded=true&devUri=http://localhost:5173
```

You should see **Live semantic model · Demo SM** (or your configured name) and all visuals loaded from DAX.

**Production:** `npm run build` and deploy `dist/` to your Fabric App item.

---

## Verify visuals

| UI | DAX export in `queries.ts` | Tables |
|----|------------------------------|--------|
| KPI cards | `kpiQuery` | `fact_report_adoption`, `fact_migration_backlog`, `fact_team_readiness` |
| Adoption trend | `adoptionTrendQuery` | `fact_report_adoption` |
| Channel mix | `channelMixQuery` | `fact_channel_mix`, `dim_channel` |
| Team readiness | `teamReadinessQuery` | `fact_team_readiness`, `dim_team` |
| Backlog grid | `backlogQuery` | `fact_migration_backlog`, `dim_team` |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `Semantic model 'migrationPulse' not found` | Stale `fabric.generated.ts` or wrong `fabric.yaml` shape | Use `semanticModels:` group; run `npm run fabric:generate`; hard refresh |
| `YOUR-WORKSPACE-GUID` in errors | Generate step skipped | Run `npm run fabric:generate`; verify output file |
| Loading spinners on `localhost:5173` alone | Expected — no Fabric host | Open via Fabric App with `fabricEmbedded=true` |
| `Not running inside a Fabric iframe` | Same as above | Use Fabric App embed URL |
| Auth / `VITE_RAYFIN_*` errors | Missing or empty `.env.fabric` | Fill publishable key; restart `npm run dev` |
| DAX column / relationship errors | Model column names differ | Match names in `queries.ts`; use `LOOKUPVALUE` pattern already in repo |
| Donut chart clipped | Fixed in Vega spec | Pull latest; legend is bottom-aligned |
| `npm run fabric:generate` silent / empty config | Wrong YAML under `connections:` | Move entries under `semanticModels:` |

---

## Key commands

```bash
npm run dev                 # local UI (portal embed required for data)
npm test                    # unit tests (mock DAX)
npm run fabric:generate     # fabric.yaml → src/fabric.generated.ts
npm run warehouse:sql -- --demo
npm run schema:scrape         # refresh schema/tables from Demo DW
```

---

## Next steps

- **Concepts:** `docs/CONCEPTS.md`
- **Detailed wiring reference:** `docs/wire-semantic-model.md`
- **Change the page safely:** `.cursor/skills/modify-fabric-data-app/SKILL.md`
- **Live talk exercise:** `docs/talk/live-demo.md`

---

## Optional — Official Fabric skills

This repo ships one project skill (`modify-fabric-data-app`) for Migration Pulse UI changes. Microsoft also publishes a larger [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) catalog for warehouse, semantic model, PBIP, and platform work.

Install for Cursor with the [skills CLI](https://github.com/vercel-labs/skills):

```bash
# Global (recommended — full catalog, every project)
npx skills add microsoft/skills-for-fabric -a cursor -g -y

# Or use this repo's helper (defaults to global)
npm run skills:install
```

Project-scoped (team-shared; commit `.cursor/skills/` or `.agents/skills/`):

```bash
SKILLS_GLOBAL=0 npm run skills:install
```

After install, open a new Cursor chat. Verify: `npx skills list -g`.

See [docs/skills-for-fabric.md](skills-for-fabric.md) for scope options, bundles, and Copilot CLI equivalents.
