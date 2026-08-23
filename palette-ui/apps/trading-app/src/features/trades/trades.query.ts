import { useQuery, useApiClient } from '@palette/platform-sdk';
import { tradesService } from './api';
import { tradeKeys } from './trades.keys';

export function useTrades() {
  const api = useApiClient();

  return useQuery({
    queryKey: tradeKeys.lists(),
    queryFn: () => tradesService.getTrades(api),
  });
}

export function useDashboardSummary() {
  const api = useApiClient();

  return useQuery({
    queryKey: tradeKeys.list({ scope: 'dashboard-summary' }),
    queryFn: () => tradesService.getDashboardSummary(api),
  });
}
