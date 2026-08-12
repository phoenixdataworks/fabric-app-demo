# Wire the semantic model

Reference for connecting Migration Pulse to **Demo SM** (or your semantic model) over **Demo DW**. For the full first-time checklist, see **[GETTING_STARTED.md](GETTING_STARTED.md)**.

---

## Overview

```text
warehouse/migration-pulse.sql  →  Demo DW tables
        ↓
Semantic model (Reporting tab)  →  six tables, DAX
        ↓
fabric.yaml + fabric:generate   →  alias migrationPulse in src/fabric.generated.ts
        ↓
.env.fabric + Fabric App item   →  portal auth
        ↓
npm run dev + ?fabricEmbedded=true  →  live charts and grid
```

The app **always** runs DAX. Localhost without the Fabric App embed shows auth or loading states only.

---

## Create the semantic model (warehouse path)

Do **not** use workspace **New item → Semantic model** (OneLake / lakehouse path).

1. Open **Demo DW** → **Reporting** → **New semantic model**.
2. Name the model (e.g. **Demo SM**).
3. Add: `dim_team`, `dim_channel`, `fact_report_adoption`, `fact_channel_mix`, `fact_team_readiness`, `fact_migration_backlog`.
4. **Save**.

Relationships are **optional**. Queries in `src/queries/migration-pulse-live/queries.ts` use **`LOOKUPVALUE`** to resolve dimension names without model relationships.

Alternative: Power BI Desktop → **OneLake** → warehouse SQL endpoint → Import or DirectQuery → Publish.

Docs: [Create a semantic model from a warehouse](https://learn.microsoft.com/en-us/fabric/data-warehouse/create-semantic-model).

---

## Register the connection

```bash
cp fabric.yaml.example fabric.yaml
# edit IDs
npm run fabric:generate
```

Required YAML shape:

```yaml
activeProfile: default
profiles:
  default:
    semanticModels:
      migrationPulse:
        workspaceId: YOUR-WORKSPACE-GUID
        itemId: YOUR-SEMANTIC-MODEL-GUID
```

| Name | Meaning |
|------|---------|
| **Demo SM** | Display name in Fabric portal (`src/config/semantic-model.ts`) |
| **migrationPulse** | Code alias in `fabric.yaml` and DAX hooks — must match `SEMANTIC_MODEL_CONNECTION` in `queries.ts` |

CLI alternative:

```bash
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js add semanticModel migrationPulse \
  -w <workspaceId> -i <semanticModelId>
npm run fabric:generate
```

Verify:

```bash
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js query migrationPulse \
  --query "EVALUATE fact_report_adoption"
```

---

## Fabric App env

```bash
cp .env.fabric.example .env.fabric
```

| Variable | Points to |
|----------|-----------|
| `VITE_FABRIC_ITEM_ID` | **Fabric App** item (not semantic model) |
| `VITE_RAYFIN_PUBLISHABLE_KEY` | App publishable key (`pk-...`) — required |

`npm run dev` runs `predev`, which copies `.env.fabric` → `.env.development.local`.

---

## Run in the portal

```bash
npm run dev
```

Open the **Fabric App** URL with:

```text
?fabricEmbedded=true&devUri=http://localhost:5173
```

---

## DAX design notes

- **Facts-only queries** (adoption, KPIs): direct table references.
- **Dimension labels** (channel, team, domain): `LOOKUPVALUE(dim_*[name], dim_*[key], fact_*[key])` — works without semantic model relationships.
- **Column metadata** in `queries.ts` must match Vega spec field names (`month`, `channel`, `readiness`, etc.).
- **`to-data-table.ts`** normalizes DAX column names such as `[month]` and `fact_x[col]`.

---

## Visual map

| Visual | Query | Tables |
|--------|-------|--------|
| KPI cards | `kpiQuery` | adoption, backlog, readiness facts |
| Adoption trend | `adoptionTrendQuery` | `fact_report_adoption` |
| Channel mix | `channelMixQuery` | `fact_channel_mix`, `dim_channel` |
| Team readiness | `teamReadinessQuery` | `fact_team_readiness`, `dim_team` |
| Backlog grid | `backlogQuery` | `fact_migration_backlog`, `dim_team` |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `migrationPulse` not found | Run `npm run fabric:generate`; confirm `semanticModels:` in YAML |
| Empty `fabric.generated.ts` | Wrong YAML key (`connections:`) — use `semanticModels:` |
| Not running inside Fabric iframe | Open Fabric **App** with `fabricEmbedded=true` |
| Auth errors | Fill `VITE_RAYFIN_PUBLISHABLE_KEY`; restart dev |
| RELATED / relationship DAX errors | Use `LOOKUPVALUE` pattern from existing queries |
| Donut clipped | Use current `report-mix.json` (bottom legend, auto outer radius) |

---

## Source files

| Path | Role |
|------|------|
| `fabric.yaml` | Connection IDs (gitignored) |
| `src/fabric.generated.ts` | Generated client config |
| `src/queries/migration-pulse-live/queries.ts` | DAX strings |
| `src/components/demo/LiveVegaChart.tsx` | Chart + DAX hook |
| `src/components/demo/LiveDataGrid.tsx` | Grid + DAX hook |
| `src/hooks/use-semantic-model-query.ts` | Query execution |
| `src/lib/fabric-client.ts` | Fabric SDK + embed proxy |
