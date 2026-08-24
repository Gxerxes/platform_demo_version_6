import type { ApiClient, PageRequest, PageResponse } from '@palette/platform-sdk';
import type {
  CreateTradeRequest,
  DailyReport,
  DashboardSummary,
  Settlement,
  Trade,
} from './types';

export const tradesService = {
  getDashboardSummary(api: ApiClient) {
    return api.get<DashboardSummary>('/dashboard/summary');
  },

  getTrades(api: ApiClient) {
    return api.get<Trade[]>('/trades');
  },

  getTradesPage(api: ApiClient, pageRequest?: PageRequest) {
    return api.getPage<Trade>('/trades', pageRequest);
  },

  createTrade(api: ApiClient, payload: CreateTradeRequest) {
    return api.post<Trade>('/trades', payload);
  },

  getSettlements(api: ApiClient) {
    return api.get<Settlement[]>('/settlements');
  },

  getDailyReport(api: ApiClient) {
    return api.get<DailyReport>('/reports/daily');
  },
};

export function createTradingApi(api: ApiClient) {
  return {
    getDashboardSummary: () => tradesService.getDashboardSummary(api),
    getTrades: () => tradesService.getTrades(api),
    getTradesPage: (pageRequest?: PageRequest) => tradesService.getTradesPage(api, pageRequest),
    createTrade: (payload: CreateTradeRequest) => tradesService.createTrade(api, payload),
    getSettlements: () => tradesService.getSettlements(api),
    getDailyReport: () => tradesService.getDailyReport(api),
  };
}

export type TradingApi = ReturnType<typeof createTradingApi>;
export type { PageResponse };
