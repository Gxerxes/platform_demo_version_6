import type { ApiClient, PageRequest } from '@palette/platform-sdk';
import type { Trade } from './types';

export const tradesService = {
  getTradesPage(api: ApiClient, pageRequest: PageRequest) {
    return api.getPage<Trade>('/trades', pageRequest);
  },
};
