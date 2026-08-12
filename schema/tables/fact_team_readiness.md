# dbo.fact_team_readiness

Weekly migration readiness score by business team.

## Columns

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| team | nvarchar(50) | NO | Business domain (Finance, Operations, Clinical, Engineering, Executive) |
| week | nvarchar(10) | NO | Week label (W1–W4) |
| readiness | int | NO | Readiness score 0–100 |
