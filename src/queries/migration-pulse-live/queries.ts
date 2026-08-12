export const SEMANTIC_MODEL_CONNECTION = 'migrationPulse';

export const adoptionTrendQuery = `
EVALUATE
SELECTCOLUMNS(
    fact_report_adoption,
    "month", fact_report_adoption[month],
    "legacyMssql", fact_report_adoption[legacy_mssql],
    "snowflake", fact_report_adoption[snowflake]
)
`.trim();

export const adoptionTrendColumnMetadata = {
  month: { name: 'month', displayName: 'Month' },
  legacyMssql: { name: 'legacyMssql', displayName: 'Legacy MSSQL', format: '#,0' },
  snowflake: { name: 'snowflake', displayName: 'Snowflake path', format: '#,0' },
} as const;

export const channelMixQuery = `
EVALUATE
SELECTCOLUMNS(
    ADDCOLUMNS(
        fact_channel_mix,
        "channel",
        LOOKUPVALUE(
            dim_channel[channel_name],
            dim_channel[channel_key],
            fact_channel_mix[channel_key]
        )
    ),
    "channel", [channel],
    "reports", fact_channel_mix[reports]
)
`.trim();

export const channelMixColumnMetadata = {
  channel: { name: 'channel', displayName: 'Channel' },
  reports: { name: 'reports', displayName: 'Reports', format: '#,0' },
} as const;

export const teamReadinessQuery = `
EVALUATE
SELECTCOLUMNS(
    ADDCOLUMNS(
        fact_team_readiness,
        "team",
        LOOKUPVALUE(
            dim_team[team_name],
            dim_team[team_key],
            fact_team_readiness[team_key]
        )
    ),
    "team", [team],
    "week", fact_team_readiness[week],
    "readiness", fact_team_readiness[readiness]
)
`.trim();

export const teamReadinessColumnMetadata = {
  team: { name: 'team', displayName: 'Team' },
  week: { name: 'week', displayName: 'Week' },
  readiness: { name: 'readiness', displayName: 'Readiness score', format: '0' },
} as const;

export const backlogQuery = `
EVALUATE
SELECTCOLUMNS(
    ADDCOLUMNS(
        fact_migration_backlog,
        "domain",
        LOOKUPVALUE(
            dim_team[team_name],
            dim_team[team_key],
            fact_migration_backlog[team_key]
        )
    ),
    "report", fact_migration_backlog[report],
    "domain", [domain],
    "owner", fact_migration_backlog[owner],
    "stage", fact_migration_backlog[stage],
    "risk", fact_migration_backlog[risk],
    "targetDate", fact_migration_backlog[target_date]
)
`.trim();

export const backlogColumnMetadata = {
  report: { name: 'report', displayName: 'Report' },
  domain: { name: 'domain', displayName: 'Domain' },
  owner: { name: 'owner', displayName: 'Owner' },
  stage: { name: 'stage', displayName: 'Stage' },
  risk: { name: 'risk', displayName: 'Risk' },
  targetDate: { name: 'targetDate', displayName: 'Target' },
} as const;

export const kpiQuery = `
EVALUATE
ROW(
    "reportsOnSnowflake",
    CALCULATE(MAX(fact_report_adoption[snowflake]), ALL(fact_report_adoption)),
    "legacyMssql",
    CALCULATE(MAX(fact_report_adoption[legacy_mssql]), ALL(fact_report_adoption)),
    "backlogCount",
    COUNTROWS(fact_migration_backlog),
    "avgReadiness",
    ROUND(AVERAGE(fact_team_readiness[readiness]), 0)
)
`.trim();

export const kpiColumnMetadata = {
  reportsOnSnowflake: { name: 'reportsOnSnowflake', displayName: 'Reports on Snowflake', format: '#,0' },
  legacyMssql: { name: 'legacyMssql', displayName: 'Legacy MSSQL reports', format: '#,0' },
  backlogCount: { name: 'backlogCount', displayName: 'Open backlog items', format: '#,0' },
  avgReadiness: { name: 'avgReadiness', displayName: 'Avg readiness score', format: '0' },
} as const;
