# Schema context

These Markdown files are produced by [schema-scraper](https://pypi.org/project/schema-scraper/) — table docs Cursor uses when you write SQL, DAX, or warehouse bootstrap scripts against a live database.

**Use schema-scraper to give your AI accurate column names, types, keys, and row counts** instead of guessing from memory or stale comments.

The **live app** reads the **semantic model**, not these files directly. Schema docs describe the **warehouse** that backs the model.

Full setup: **[docs/GETTING_STARTED.md](../docs/GETTING_STARTED.md)**.

---

## Install schema-scraper (PyPI)

One-time install (Python 3.10+, [ODBC Driver 18 for SQL Server](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)):

```bash
pip install "schema-scraper[mssql]"
```

PyPI: [pypi.org/project/schema-scraper](https://pypi.org/project/schema-scraper/)

Or from this repo:

```bash
pip install -r requirements-scrape.txt
```

Verify:

```bash
schema-scraper --version
```

---

## Scrape from your Fabric Warehouse

After you load tables with `warehouse/migration-pulse.sql`:

```bash
cp .env.warehouse.example .env.warehouse
# Edit DB_HOST, DB_NAME, DB_TENANT, DB_AUTH
az login --tenant YOUR-TENANT-GUID --allow-no-subscriptions
npm run schema:scrape
```

The script calls `schema-scraper` on your PATH and writes table docs to `schema/tables/`.

**No subscriptions found** after `az login` is normal for Fabric-only tenants. Use `--allow-no-subscriptions`.

Scraped docs reflect **live warehouse metadata**. Row counts use `COUNT(*)` because Fabric columnstore DMVs often report 0.

If you prefer browser login, set `DB_AUTH=ActiveDirectoryInteractive` in `.env.warehouse` and run from **Terminal.app** (the popup often does not appear in Cursor's integrated terminal).

### Local checkout (optional)

If you develop schema-scraper itself, a venv at `../schema_scraper` still works as a fallback. Override with `SCHEMA_SCRAPER_BIN` or `SCHEMA_SCRAPER_PYTHON` in `.env.warehouse`.

---

## Tables (Migration Pulse)

| Table | Role |
|-------|------|
| `dim_team` | Business teams |
| `dim_channel` | Delivery channels |
| `fact_report_adoption` | Monthly MSSQL vs Snowflake counts |
| `fact_channel_mix` | Reports per channel |
| `fact_team_readiness` | Weekly readiness scores |
| `fact_migration_backlog` | In-flight migrations |

DAX queries live in `src/queries/migration-pulse/queries.ts`. Keep column names aligned with these docs.

Cursor rules in `.cursor/rules/schema-grounding.mdc` point here. **Never invent columns that are not listed.**

---

## Hand-maintained vs scraped

Before the first scrape, this repo may commit bootstrap schema context. After scrape, review diffs — scraped files replace hand-written table docs.

Seed row narratives for SQL generation live in `src/lib/demo-report/migration-pulse-data.ts` (not used by the UI).
