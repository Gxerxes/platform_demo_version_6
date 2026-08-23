import type { ApiClient } from '@palette/platform-sdk';
import type {
  CreateTradeRequest,
  DailyReport,
  DashboardSummary,
  Settlement,
  Trade,
} from './types';

export function createTradingApi(api: ApiClient) {
  return {
    getDashboardSummary: () => api.get<DashboardSummary>('/dashboard/summary'),
    getTrades: () => api.get<Trade[]>('/trades'),
    createTrade: (payload: CreateTradeRequest) => api.post<Trade>('/trades', payload),
    getSettlements: () => api.get<Settlement[]>('/settlements'),
    getDailyReport: () => api.get<DailyReport>('/reports/daily'),
  };
}

export type TradingApi = ReturnType<typeof createTradingApi>;
