import type { ColumnDef, DataTable } from '@microsoft/fabric-visuals-core';

/** Demo narrative: MSSQL → Snowflake + Power BI migration program. */

export type KpiFormat = 'number' | 'percent';
export type KpiSentiment = 'up' | 'down' | 'neutral';

export interface MigrationKpi {
  value: number;
  delta: string;
  label: string;
  format: KpiFormat;
  sentiment: KpiSentiment;
}

export const migrationKpis = {
  reportsMigrated: {
    value: 148,
    delta: '+12 this month',
    label: 'Reports on Snowflake',
    format: 'number',
    sentiment: 'up',
  },
  activeUsers: {
    value: 892,
    delta: '+6.4% vs prior month',
    label: 'Monthly active consumers',
    format: 'number',
    sentiment: 'up',
  },
  avgTimeToFind: {
    value: 47,
    delta: '−18s vs legacy portal',
    label: 'Median time to open report (sec)',
    format: 'number',
    sentiment: 'up',
  },
  endorsementRate: {
    value: 72,
    delta: '8 pending review',
    label: 'Endorsed catalog assets (%)',
    format: 'percent',
    sentiment: 'neutral',
  },
} as const satisfies Record<string, MigrationKpi>;

export const adoptionTrendTable: DataTable = {
  columns: [
    { name: 'month', displayName: 'Month' },
    { name: 'legacyMssql', displayName: 'Legacy MSSQL', format: '#,0' },
    { name: 'snowflake', displayName: 'Snowflake path', format: '#,0' },
  ],
  rows: [
    ['Jan', 420, 38],
    ['Feb', 395, 52],
    ['Mar', 360, 71],
    ['Apr', 328, 96],
    ['May', 290, 118],
    ['Jun', 252, 148],
  ],
};

export const reportMixTable: DataTable = {
  columns: [
    { name: 'channel', displayName: 'Channel' },
    { name: 'reports', displayName: 'Reports', format: '#,0' },
  ],
  rows: [
    ['Power BI (Snowflake)', 148],
    ['Power BI (MSSQL)', 252],
    ['Crystal (linked)', 64],
    ['Custom (Reportal)', 12],
  ],
};

export const teamReadinessTable: DataTable = {
  columns: [
    { name: 'team', displayName: 'Team' },
    { name: 'week', displayName: 'Week' },
    { name: 'readiness', displayName: 'Readiness score', format: '0' },
  ],
  rows: [
    ['Finance', 'W1', 42],
    ['Finance', 'W2', 58],
    ['Finance', 'W3', 71],
    ['Finance', 'W4', 84],
    ['Operations', 'W1', 35],
    ['Operations', 'W2', 49],
    ['Operations', 'W3', 62],
    ['Operations', 'W4', 78],
    ['Clinical', 'W1', 28],
    ['Clinical', 'W2', 44],
    ['Clinical', 'W3', 55],
    ['Clinical', 'W4', 69],
    ['Engineering', 'W1', 61],
    ['Engineering', 'W2', 72],
    ['Engineering', 'W3', 81],
    ['Engineering', 'W4', 91],
    ['Executive', 'W1', 88],
    ['Executive', 'W2', 90],
    ['Executive', 'W3', 94],
    ['Executive', 'W4', 97],
  ],
};

export const backlogTable: DataTable = {
  columns: [
    { name: 'report', displayName: 'Report' },
    { name: 'domain', displayName: 'Domain' },
    { name: 'owner', displayName: 'Owner' },
    { name: 'stage', displayName: 'Stage' },
    { name: 'risk', displayName: 'Risk' },
    { name: 'targetDate', displayName: 'Target' },
  ],
  rows: [
    ['AR Aging Detail', 'Finance', 'J. Rivera', 'Validation', 'Medium', '2026-06-15'],
    ['OR Utilization', 'Clinical', 'S. Patel', 'Model rewrite', 'High', '2026-06-22'],
    ['Shift Handoff SLA', 'Operations', 'M. Chen', 'UAT', 'Low', '2026-06-08'],
    ['CapEx Forecast', 'Finance', 'A. Brooks', 'Published', 'Low', '2026-05-30'],
    ['Supplier OTIF', 'Operations', 'L. Nguyen', 'Discovery', 'Medium', '2026-07-01'],
    ['Census & Capacity', 'Clinical', 'R. Okonkwo', 'Validation', 'High', '2026-06-18'],
  ],
};
