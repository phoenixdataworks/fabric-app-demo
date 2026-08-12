# Warehouse bootstrap SQL

Generate `CREATE TABLE` and `INSERT` scripts for the Migration Pulse star schema (two dimensions, four facts).

Part of the full path documented in **[docs/GETTING_STARTED.md](../docs/GETTING_STARTED.md)**.

## Generate SQL

```bash
npm run warehouse:sql              # random seed data
npm run warehouse:sql -- --demo    # rows that match migration-pulse-data.ts (recommended)
npm run warehouse:sql -- --seed 7  # reproducible random data
```

Output:

- `warehouse/migration-pulse.sql` — drop (top), then create and insert
- `warehouse/drop-migration-pulse.sql` — drop only

Run the bootstrap script in your Fabric **Warehouse** SQL editor (e.g. **Demo DW**).

## Tables

| Table | Role |
|-------|------|
| `dbo.dim_team` | Business teams |
| `dbo.dim_channel` | Delivery channels |
| `dbo.fact_report_adoption` | Monthly MSSQL vs Snowflake counts |
| `dbo.fact_channel_mix` | Reports per channel (`channel_key` → `dim_channel`) |
| `dbo.fact_team_readiness` | Weekly readiness scores (`team_key` → `dim_team`) |
| `dbo.fact_migration_backlog` | In-flight migrations (`team_key` → `dim_team`) |

Facts reference dimensions through `team_key` and `channel_key`. The **React app** joins dimensions in **DAX** (`LOOKUPVALUE` in `src/queries/migration-pulse/queries.ts`). Add semantic model relationships in Fabric if you prefer `RELATED()` instead.

## Notes

- Fabric Warehouse does not support `nvarchar`. The generator uses `varchar`.
- Primary and foreign keys are **NOT ENFORCED** so schema-scraper and Power BI can detect relationships.
- `src/lib/demo-report/migration-pulse-data.ts` is the **seed source for `--demo`** only — the UI does not read this file.

## After loading data

1. Create a semantic model from the warehouse **Reporting** tab (see GETTING_STARTED).
2. Optional: refresh Cursor schema docs with [schema-scraper](https://pypi.org/project/schema-scraper/):

```bash
pip install "schema-scraper[mssql]"
cp .env.warehouse.example .env.warehouse
npm run schema:scrape
```

See `schema/README.md`.
