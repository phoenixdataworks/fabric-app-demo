import { DataGrid } from '@microsoft/fabric-datagrid';
import { useCssTheme } from '@microsoft/fabric-visuals';

import { QueryState } from '@/components/demo/QueryState';
import { useSemanticModelQuery } from '@/hooks/use-semantic-model-query';
import {
  type ColumnMetadataMap,
  toDataTable,
} from '@/lib/to-data-table';
import { SEMANTIC_MODEL_CONNECTION } from '@/queries/migration-pulse-live/queries';

interface LiveDataGridProps {
  query: string;
  columnMetadata: ColumnMetadataMap;
  minHeight?: number;
}

export function LiveDataGrid({
  query,
  columnMetadata,
  minHeight = 220,
}: LiveDataGridProps) {
  const theme = useCssTheme();
  const { data, isLoading, error } = useSemanticModelQuery({
    connection: SEMANTIC_MODEL_CONNECTION,
    query,
  });

  const table =
    data?.status === 'success'
      ? toDataTable(data.table, columnMetadata)
      : undefined;

  return (
    <QueryState isLoading={isLoading} error={error} minHeight={minHeight}>
      {table ? <DataGrid data={table} theme={theme} /> : null}
    </QueryState>
  );
}
