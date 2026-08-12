import { VegaVisual, useCssTheme, type VisualizationSpec } from '@microsoft/fabric-visuals';

import { QueryState } from '@/components/demo/QueryState';
import { useSemanticModelQuery } from '@/hooks/use-semantic-model-query';
import {
  type ColumnMetadataMap,
  toDataTable,
} from '@/lib/to-data-table';
import { SEMANTIC_MODEL_CONNECTION } from '@/queries/migration-pulse-live/queries';

interface LiveVegaChartProps {
  query: string;
  columnMetadata: ColumnMetadataMap;
  spec: VisualizationSpec;
  minHeight?: number;
}

export function LiveVegaChart({
  query,
  columnMetadata,
  spec,
  minHeight = 280,
}: LiveVegaChartProps) {
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
      {table ? (
        <div className="h-full min-h-0 w-full flex-1">
          <VegaVisual spec={spec} data={table} theme={theme} />
        </div>
      ) : null}
    </QueryState>
  );
}
