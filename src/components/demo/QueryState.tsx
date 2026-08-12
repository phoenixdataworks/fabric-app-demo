interface QueryStateProps {
  isLoading: boolean;
  error: Error | undefined;
  children: React.ReactNode;
  minHeight?: number;
}

export function QueryState({
  isLoading,
  error,
  children,
  minHeight = 200,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center text-200 text-muted-foreground"
        style={{ minHeight }}
      >
        Loading live data…
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center px-4 text-center text-200 text-destructive"
        style={{ minHeight }}
      >
        {error.message}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">{children}</div>
  );
}
