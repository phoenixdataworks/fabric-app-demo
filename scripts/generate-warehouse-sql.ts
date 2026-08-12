/**
 * Generate Fabric Warehouse DDL + INSERT scripts for Migration Pulse tables.
 *
 * Usage:
 *   npm run warehouse:sql              # random seed data (default)
 *   npm run warehouse:sql -- --demo    # rows that match the demo app
 *   npm run warehouse:sql -- --seed 7  # reproducible random data
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  adoptionTrendTable,
  backlogTable,
  reportMixTable,
  teamReadinessTable,
} from '../src/lib/demo-report/migration-pulse-data.ts';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, '..');
const defaultOut = join(repoRoot, 'warehouse', 'migration-pulse.sql');
const defaultDropOut = join(repoRoot, 'warehouse', 'drop-migration-pulse.sql');

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const TEAM_DIM = [
  { key: 1, name: 'Finance', portfolio: 'Corporate' },
  { key: 2, name: 'Operations', portfolio: 'Care delivery' },
  { key: 3, name: 'Clinical', portfolio: 'Care delivery' },
  { key: 4, name: 'Engineering', portfolio: 'Technology' },
  { key: 5, name: 'Executive', portfolio: 'Corporate' },
] as const;

const WEEKS = ['W1', 'W2', 'W3', 'W4'] as const;

const CHANNELS = [
  'Power BI (Snowflake)',
  'Power BI (MSSQL)',
  'Crystal (linked)',
  'Custom (Reportal)',
  'SSRS (legacy)',
  'Excel (shared)',
] as const;

const STAGES = [
  'Discovery',
  'Model rewrite',
  'Validation',
  'UAT',
  'Published',
] as const;

const RISKS = ['Low', 'Medium', 'High'] as const;

const REPORT_NAMES = [
  'AR Aging Detail',
  'OR Utilization',
  'Shift Handoff SLA',
  'CapEx Forecast',
  'Supplier OTIF',
  'Census & Capacity',
  'Revenue Cycle KPIs',
  'Bed Turnover',
  'Labor Productivity',
  'Claims Denial Rate',
  'Inventory Turns',
  'Patient Satisfaction',
  'Provider Productivity',
  'Budget vs Actual',
  'Quality Scorecard',
] as const;

const OWNERS = [
  'J. Rivera',
  'S. Patel',
  'M. Chen',
  'A. Brooks',
  'L. Nguyen',
  'R. Okonkwo',
  'K. Singh',
  'T. Williams',
  'D. Garcia',
  'N. Kim',
] as const;

type SqlValue = string | number;

interface TableSpec {
  name: string;
  columns: { name: string; type: string }[];
  rows: SqlValue[][];
}

interface WarehouseSpec {
  dimensions: TableSpec[];
  facts: TableSpec[];
}

interface ChannelDimRow {
  key: number;
  name: string;
  platform: string;
}

function parseArgs(argv: string[]) {
  let mode: 'random' | 'demo' = 'random';
  let seed = Date.now();
  let backlogRows = 24;
  let out = defaultOut;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--demo') {
      mode = 'demo';
    } else if (arg === '--random') {
      mode = 'random';
    } else if (arg === '--seed' && argv[i + 1]) {
      seed = Number(argv[++i]);
      if (Number.isNaN(seed)) throw new Error('--seed requires a number');
    } else if (arg === '--backlog-rows' && argv[i + 1]) {
      backlogRows = Number(argv[++i]);
      if (Number.isNaN(backlogRows) || backlogRows < 1) {
        throw new Error('--backlog-rows requires a positive number');
      }
    } else if (arg === '--out' && argv[i + 1]) {
      out = argv[++i]!;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}. Run with --help.`);
    }
  }

  return { mode, seed, backlogRows, out };
}

function printHelp() {
  console.log(`Generate Fabric Warehouse SQL for Migration Pulse tables.

Usage:
  npm run warehouse:sql [-- options]

Options:
  --demo              Use seed rows from migration-pulse-data.ts
  --random            Random seed data (default)
  --seed <n>          RNG seed for reproducible random data
  --backlog-rows <n>  Backlog row count in random mode (default: 24)
  --out <path>        Output file (default: warehouse/migration-pulse.sql)
  --help              Show this message
`);
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

function intBetween(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlLiteral(value: SqlValue): string {
  if (typeof value === 'number') return String(value);
  return sqlString(value);
}

function channelPlatform(channelName: string): string {
  if (channelName.includes('Snowflake')) return 'Snowflake';
  if (channelName.includes('MSSQL')) return 'MSSQL';
  if (channelName.includes('Crystal') || channelName.includes('SSRS')) {
    return 'Legacy';
  }
  return 'Custom';
}

function teamKeyByName(name: string): number {
  const team = TEAM_DIM.find((row) => row.name === name);
  if (!team) throw new Error(`Unknown team name: ${name}`);
  return team.key;
}

function buildTeamDimension(): TableSpec {
  return {
    name: 'dim_team',
    columns: [
      { name: 'team_key', type: 'int NOT NULL' },
      { name: 'team_name', type: 'varchar(50) NOT NULL' },
      { name: 'portfolio', type: 'varchar(50) NOT NULL' },
    ],
    rows: TEAM_DIM.map((team) => [team.key, team.name, team.portfolio]),
  };
}

function buildChannelDimension(channels: ChannelDimRow[]): TableSpec {
  return {
    name: 'dim_channel',
    columns: [
      { name: 'channel_key', type: 'int NOT NULL' },
      { name: 'channel_name', type: 'varchar(100) NOT NULL' },
      { name: 'platform', type: 'varchar(50) NOT NULL' },
    ],
    rows: channels.map((channel) => [
      channel.key,
      channel.name,
      channel.platform,
    ]),
  };
}

function channelLookup(channels: ChannelDimRow[]): Map<string, number> {
  return new Map(channels.map((channel) => [channel.name, channel.key]));
}

function demoWarehouse(): WarehouseSpec {
  const channels: ChannelDimRow[] = reportMixTable.rows.map(
    ([channelName], index) => ({
      key: index + 1,
      name: String(channelName),
      platform: channelPlatform(String(channelName)),
    }),
  );
  const channelByName = channelLookup(channels);

  return {
    dimensions: [buildTeamDimension(), buildChannelDimension(channels)],
    facts: [
      {
        name: 'fact_report_adoption',
        columns: [
          { name: 'month', type: 'varchar(10) NOT NULL' },
          { name: 'legacy_mssql', type: 'int NOT NULL' },
          { name: 'snowflake', type: 'int NOT NULL' },
        ],
        rows: adoptionTrendTable.rows.map(([month, legacyMssql, snowflake]) => [
          month,
          legacyMssql,
          snowflake,
        ]),
      },
      {
        name: 'fact_channel_mix',
        columns: [
          { name: 'channel_key', type: 'int NOT NULL' },
          { name: 'reports', type: 'int NOT NULL' },
        ],
        rows: reportMixTable.rows.map(([channelName, reports]) => [
          channelByName.get(String(channelName))!,
          reports,
        ]),
      },
      {
        name: 'fact_team_readiness',
        columns: [
          { name: 'team_key', type: 'int NOT NULL' },
          { name: 'week', type: 'varchar(10) NOT NULL' },
          { name: 'readiness', type: 'int NOT NULL' },
        ],
        rows: teamReadinessTable.rows.map(([team, week, readiness]) => [
          teamKeyByName(String(team)),
          week,
          readiness,
        ]),
      },
      {
        name: 'fact_migration_backlog',
        columns: [
          { name: 'report', type: 'varchar(200) NOT NULL' },
          { name: 'team_key', type: 'int NOT NULL' },
          { name: 'owner', type: 'varchar(100) NOT NULL' },
          { name: 'stage', type: 'varchar(50) NOT NULL' },
          { name: 'risk', type: 'varchar(20) NOT NULL' },
          { name: 'target_date', type: 'date NOT NULL' },
        ],
        rows: backlogTable.rows.map(
          ([report, domain, owner, stage, risk, targetDate]) => [
            report,
            teamKeyByName(String(domain)),
            owner,
            stage,
            risk,
            targetDate,
          ],
        ),
      },
    ],
  };
}

function randomWarehouse(seed: number, backlogRows: number): WarehouseSpec {
  const rng = mulberry32(seed);

  const monthCount = intBetween(rng, 6, 12);
  const startLegacy = intBetween(rng, 350, 500);
  const startSnowflake = intBetween(rng, 20, 80);
  const adoptionRows: SqlValue[][] = [];

  for (let i = 0; i < monthCount; i += 1) {
    const legacy = Math.max(
      40,
      Math.round(
        startLegacy - i * intBetween(rng, 18, 35) + intBetween(rng, -8, 8),
      ),
    );
    const snowflake = Math.min(
      500,
      Math.round(
        startSnowflake + i * intBetween(rng, 12, 28) + intBetween(rng, -5, 5),
      ),
    );
    adoptionRows.push([MONTHS[i]!, legacy, snowflake]);
  }

  const channelCount = intBetween(rng, 4, CHANNELS.length);
  const channels: ChannelDimRow[] = [];
  const usedChannels = new Set<string>();
  while (channels.length < channelCount) {
    const name = pick(rng, CHANNELS);
    if (usedChannels.has(name)) continue;
    usedChannels.add(name);
    channels.push({
      key: channels.length + 1,
      name,
      platform: channelPlatform(name),
    });
  }

  const channelMixRows: SqlValue[][] = channels.map((channel) => [
    channel.key,
    intBetween(rng, 8, 320),
  ]);

  const readinessRows: SqlValue[][] = [];
  for (const team of TEAM_DIM) {
    let score = intBetween(rng, 20, 45);
    for (const week of WEEKS) {
      score = Math.min(100, score + intBetween(rng, 8, 18));
      readinessRows.push([team.key, week, score]);
    }
  }

  const backlog: SqlValue[][] = [];
  const usedReports = new Set<string>();
  for (let i = 0; i < backlogRows; i += 1) {
    let report = pick(rng, REPORT_NAMES);
    while (usedReports.has(report) && usedReports.size < REPORT_NAMES.length) {
      report = pick(rng, REPORT_NAMES);
    }
    usedReports.add(report);

    const month = intBetween(rng, 5, 11);
    const day = intBetween(rng, 1, 28);
    backlog.push([
      report,
      pick(rng, TEAM_DIM).key,
      pick(rng, OWNERS),
      pick(rng, STAGES),
      pick(rng, RISKS),
      `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    ]);
  }

  return {
    dimensions: [buildTeamDimension(), buildChannelDimension(channels)],
    facts: [
      {
        name: 'fact_report_adoption',
        columns: [
          { name: 'month', type: 'varchar(10) NOT NULL' },
          { name: 'legacy_mssql', type: 'int NOT NULL' },
          { name: 'snowflake', type: 'int NOT NULL' },
        ],
        rows: adoptionRows,
      },
      {
        name: 'fact_channel_mix',
        columns: [
          { name: 'channel_key', type: 'int NOT NULL' },
          { name: 'reports', type: 'int NOT NULL' },
        ],
        rows: channelMixRows,
      },
      {
        name: 'fact_team_readiness',
        columns: [
          { name: 'team_key', type: 'int NOT NULL' },
          { name: 'week', type: 'varchar(10) NOT NULL' },
          { name: 'readiness', type: 'int NOT NULL' },
        ],
        rows: readinessRows,
      },
      {
        name: 'fact_migration_backlog',
        columns: [
          { name: 'report', type: 'varchar(200) NOT NULL' },
          { name: 'team_key', type: 'int NOT NULL' },
          { name: 'owner', type: 'varchar(100) NOT NULL' },
          { name: 'stage', type: 'varchar(50) NOT NULL' },
          { name: 'risk', type: 'varchar(20) NOT NULL' },
          { name: 'target_date', type: 'date NOT NULL' },
        ],
        rows: backlog,
      },
    ],
  };
}

function renderDropBlock(tableName: string): string[] {
  return [
    `IF OBJECT_ID(N'dbo.${tableName}', N'U') IS NOT NULL`,
    `    DROP TABLE dbo.${tableName};`,
    'GO',
    '',
  ];
}

function renderDropSql(spec: WarehouseSpec): string {
  const lines: string[] = [
    '-- Migration Pulse warehouse teardown',
    '-- Generated by: npm run warehouse:sql',
    '-- Run in a Fabric Warehouse SQL endpoint to remove all demo tables.',
    '-- Drop facts before dimensions.',
    '',
  ];

  for (const table of spec.facts) {
    lines.push(...renderDropBlock(table.name));
  }
  for (const table of spec.dimensions) {
    lines.push(...renderDropBlock(table.name));
  }

  return `${lines.join('\n')}\n`;
}

function renderTableBlock(table: TableSpec): string[] {
  const columnList = table.columns.map((c) => c.name).join(', ');
  const lines: string[] = [];

  lines.push(`CREATE TABLE dbo.${table.name} (`);
  table.columns.forEach((column, index) => {
    const comma = index < table.columns.length - 1 ? ',' : '';
    lines.push(`    ${column.name} ${column.type}${comma}`);
  });
  lines.push(');');
  lines.push('GO');
  lines.push('');

  if (table.rows.length === 0) return lines;

  lines.push(`INSERT INTO dbo.${table.name} (${columnList})`);
  lines.push('VALUES');
  table.rows.forEach((row, rowIndex) => {
    const values = row.map(sqlLiteral).join(', ');
    const comma = rowIndex < table.rows.length - 1 ? ',' : ';';
    lines.push(`    (${values})${comma}`);
  });
  lines.push('GO');
  lines.push('');

  return lines;
}

function renderConstraintsBlock(): string[] {
  return [
    '-- Keys and relationships (Fabric requires ALTER TABLE; NOT ENFORCED is required)',
    'ALTER TABLE dbo.dim_team',
    '    ADD CONSTRAINT PK_dim_team PRIMARY KEY NONCLUSTERED (team_key) NOT ENFORCED;',
    'GO',
    '',
    'ALTER TABLE dbo.dim_channel',
    '    ADD CONSTRAINT PK_dim_channel PRIMARY KEY NONCLUSTERED (channel_key) NOT ENFORCED;',
    'GO',
    '',
    'ALTER TABLE dbo.fact_channel_mix',
    '    ADD CONSTRAINT FK_fact_channel_mix_channel',
    '    FOREIGN KEY (channel_key) REFERENCES dbo.dim_channel (channel_key) NOT ENFORCED;',
    'GO',
    '',
    'ALTER TABLE dbo.fact_team_readiness',
    '    ADD CONSTRAINT FK_fact_team_readiness_team',
    '    FOREIGN KEY (team_key) REFERENCES dbo.dim_team (team_key) NOT ENFORCED;',
    'GO',
    '',
    'ALTER TABLE dbo.fact_migration_backlog',
    '    ADD CONSTRAINT FK_fact_migration_backlog_team',
    '    FOREIGN KEY (team_key) REFERENCES dbo.dim_team (team_key) NOT ENFORCED;',
    'GO',
    '',
  ];
}

function renderSql(spec: WarehouseSpec, mode: 'random' | 'demo', seed: number): string {
  const dropSql = renderDropSql(spec).trimEnd();
  const lines: string[] = [
    '-- Migration Pulse warehouse bootstrap',
    '-- Generated by: npm run warehouse:sql',
    `-- Mode: ${mode}${mode === 'random' ? ` (seed ${seed})` : ''}`,
    '-- Run in a Fabric Warehouse SQL endpoint.',
    '-- String columns use varchar (Fabric Warehouse does not support nvarchar).',
    '--',
    '-- Teardown only: warehouse/drop-migration-pulse.sql',
    '',
    dropSql,
    '',
    '-- Create and load tables',
    '',
  ];

  lines.push('-- Dimensions');
  for (const table of spec.dimensions) {
    lines.push(...renderTableBlock(table));
  }

  lines.push('-- Facts');
  for (const table of spec.facts) {
    lines.push(...renderTableBlock(table));
  }

  lines.push(...renderConstraintsBlock());

  return `${lines.join('\n')}\n`;
}

function main() {
  const { mode, seed, backlogRows, out } = parseArgs(process.argv.slice(2));
  const spec =
    mode === 'demo' ? demoWarehouse() : randomWarehouse(seed, backlogRows);
  const sql = renderSql(spec, mode, seed);
  const dropSql = renderDropSql(spec);
  const dropOut =
    out === defaultOut
      ? defaultDropOut
      : join(dirname(out), 'drop-migration-pulse.sql');

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, sql, 'utf8');
  writeFileSync(dropOut, dropSql, 'utf8');

  const tables = [...spec.dimensions, ...spec.facts];
  const rowCounts = tables.map((t) => `${t.name}: ${t.rows.length} rows`).join(', ');
  console.log(`Wrote ${out}`);
  console.log(`Wrote ${dropOut}`);
  console.log(`Mode: ${mode}. ${rowCounts}`);
}

main();
