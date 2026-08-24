import { usePaginatedQuery, useApiClient } from '@palette/platform-sdk';
import { tradesService } from './api';
import { tradeKeys } from './trades.keys';

export function useTradesPage(initialPageSize = 10) {
  const api = useApiClient();

  return usePaginatedQuery({
    queryKey: tradeKeys.pageLists(),
    queryFn: (pageRequest) => tradesService.getTradesPage(api, pageRequest),
    initialPageSize,
  });
}
