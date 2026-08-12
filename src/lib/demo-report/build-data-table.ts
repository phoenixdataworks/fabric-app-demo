import type { ColumnDef, DataTable } from '@microsoft/fabric-visuals-core';

export function buildDataTable(
  columns: ColumnDef[],
  rows: unknown[][],
): DataTable {
  return { columns, rows };
}
