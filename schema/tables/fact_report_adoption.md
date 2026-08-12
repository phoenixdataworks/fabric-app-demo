# dbo.fact_report_adoption

Monthly report counts on the legacy MSSQL path vs the Snowflake path.

## Columns

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| month | nvarchar(10) | NO | Calendar month label (Jan, Feb, …) |
| legacy_mssql | int | NO | Reports still served from MSSQL |
| snowflake | int | NO | Reports served from the Snowflake path |
