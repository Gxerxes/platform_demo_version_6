import { usePaginatedQuery, useApiClient } from '@palette/platform-sdk';
import { tradesService } from './trades.service';
import { tradeKeys } from './trades.keys';

export function useTradesGrid(initialPageSize = 5) {
  const api = useApiClient();

  return usePaginatedQuery({
    queryKey: tradeKeys.pageLists(),
    queryFn: (pageRequest) => tradesService.getTradesPage(api, pageRequest),
    initialPageSize,
  });
}
