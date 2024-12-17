export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

export interface Instrument {
  symbol: string;
  data: OHLCV[];
}

export interface Signal {
  timestamp: number;
  type: 'ENTRY' | 'EXIT';
  price: number;
  reason: string;
}

export interface StrategyResult {
  signals: Signal[];
  metrics: {
    sharpeRatio: number;
    maxDrawdown: number;
    totalReturn: number;
    winRate: number;
  };
}