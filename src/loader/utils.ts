export function groupPromiseResultsByStatus<T>(
  results: PromiseSettledResult<T>[]
) {
  return results.reduce(
    (acc, result) =>
      result.status === 'fulfilled'
        ? { ...acc, fulfilled: [...acc.fulfilled, result.value] }
        : { ...acc, rejected: [...acc.rejected, result.reason] },
    {
      fulfilled: [] as T[],
      rejected: [] as unknown[],
    }
  );
}
