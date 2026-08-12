# Schema context

These Markdown files are in [schema_scraper](https://github.com/phoenixdataworks/schema_scraper) table format. They ground Cursor when editing DAX, Vega specs, and the Migration Pulse page.

The **live app** reads the **semantic model**, not these files directly. Schema docs describe the **warehouse** that backs the model.

Full setup: **[docs/GETTING_STARTED.md](../docs/GETTING_STARTED.md)**.

## Scrape from your Fabric Warehouse

After you load tables with `warehouse/migration-pulse.sql`:

```bash
cp .env.warehouse.example .env.warehouse
# Edit host, DB_NAME, DB_TENANT, DB_AUTH
az login --tenant YOUR-TENANT-GUID --allow-no-subscriptions
npm run schema:scrape
```

The script uses a local checkout of schema_scraper (default: `../schema_scraper`). It writes table docs to `schema/tables/`.

Install schema_scraper once if needed:

```bash
cd ../schema_scraper
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[mssql]"
```

**No subscriptions found** after `az login` is normal for Fabric-only tenants. Use `--allow-no-subscriptions`.

Scraped docs reflect **live warehouse metadata**. Row counts use `COUNT(*)` because Fabric columnstore DMVs often report 0.

If you prefer browser login, set `DB_AUTH=ActiveDirectoryInteractive` in `.env.warehouse` and run from **Terminal.app**.

## Tables (Migration Pulse)

| Table | Role |
|-------|------|
| `dim_team` | Business teams |
| `dim_channel` | Delivery channels |
| `fact_report_adoption` | Monthly MSSQL vs Snowflake counts |
| `fact_channel_mix` | Reports per channel |
| `fact_team_readiness` | Weekly readiness scores |
| `fact_migration_backlog` | In-flight migrations |

DAX queries live in `src/queries/migration-pulse-live/queries.ts`. Keep column names aligned with these docs.

Cursor rules in `.cursor/rules/schema-grounding.mdc` point here. **Never invent columns that are not listed.**

## Hand-maintained vs scraped

Before the first scrape, this repo may commit bootstrap schema context. After scrape, review diffs — scraped files replace hand-written table docs.

Seed row narratives for SQL generation live in `src/lib/demo-report/migration-pulse-data.ts` (not used by the UI).
