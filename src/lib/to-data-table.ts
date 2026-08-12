import type { ColumnDef, DataTable } from '@microsoft/fabric-visuals-core';
import type { QueryTable } from '@microsoft/fabric-app-data';

export type ColumnMetadataMap = Record<string, ColumnDef>;

/** DAX may return bracketed names (`[month]`) or table-qualified names (`fact_x[col]`). */
function normalizeColumnName(name: string): string {
  const tableQualified = /^[^[]+\[([^\]]+)\]$/.exec(name);
  if (tableQualified) {
    return tableQualified[1];
  }
  return name.replace(/^\[|\]$/g, '');
}

export function toDataTable(
  queryTable: QueryTable,
  columnMetadata: ColumnMetadataMap,
): DataTable {
  const columns: ColumnDef[] = queryTable.columns.map((col) => {
    const name = normalizeColumnName(col.name);
    return columnMetadata[name] ?? columnMetadata[col.name] ?? { name };
  });
  return { columns, rows: queryTable.rows };
}
