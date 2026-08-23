export interface Trade {
  id: string;
  symbol: string;
  side: string;
  quantity: number;
  status: string;
  tradeDate: string;
}

export interface CreateTradeRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
}

export interface DashboardSummary {
  totalTrades: number;
  settledTrades: number;
  pendingTrades: number;
  totalVolume: number;
  asOfDate: string;
}

export interface Settlement {
  id: string;
  tradeId: string;
  amount: number;
  currency: string;
  status: string;
  valueDate: string;
}

export interface DailyReport {
  reportDate: string;
  buyCount: number;
  sellCount: number;
  topSymbol: string;
  generatedAt: string;
}
