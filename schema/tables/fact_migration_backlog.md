# dbo.fact_migration_backlog

In-flight report migrations. Source for the Migration Pulse backlog grid.

## Columns

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| report | nvarchar(200) | NO | Report display name |
| domain | nvarchar(50) | NO | Business domain |
| owner | nvarchar(100) | NO | Migration owner |
| stage | nvarchar(50) | NO | Discovery, Model rewrite, Validation, UAT, Published |
| risk | nvarchar(20) | NO | Low, Medium, or High |
| target_date | date | NO | Target completion date |

## App field mapping

The React demo table uses `targetDate` for `target_date`. All other column names match the app field names exactly.
