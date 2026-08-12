import { useState, useEffect, useCallback } from 'react';
import type { CachedQueryResult } from '@microsoft/fabric-app-data';

import { getFabricClient } from '@/lib/fabric-client';

interface UseSemanticModelQueryOptions {
  connection: string;
  query: string;
  bypassCache?: boolean;
  enabled?: boolean;
}

interface UseSemanticModelQueryResult {
  data: CachedQueryResult | undefined;
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => Promise<void>;
}

export function useSemanticModelQuery(
  options: UseSemanticModelQueryOptions,
): UseSemanticModelQueryResult {
  const { connection, query, bypassCache, enabled = true } = options;
  const [data, setData] = useState<CachedQueryResult | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const canExecute = enabled && Boolean(connection && query);

  const execute = useCallback(async () => {
    if (!canExecute) {
      return;
    }
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getFabricClient()
        .semanticModel(connection)
        .query(query, { bypassCache });

      setData(result);

      if (result.status === 'error') {
        setError(new Error(result.error.message));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [connection, query, bypassCache, canExecute]);

  useEffect(() => {
    void execute();
  }, [execute]);

  return { data, isLoading, error, refetch: execute };
}
