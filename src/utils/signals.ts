import { Signal, OHLCV } from '../types/trading';

export function generateSignals(
  data: OHLCV[],
  sma: number[],
  rsi: number[],
  period: number
): Signal[] {
  const signals: Signal[] = [];
  let position = false;

  for (let i = period; i < data.length; i++) {
    if (!position && rsi[i] < 30 && data[i].close > sma[i]) {
      signals.push({
        timestamp: data[i].timestamp,
        type: 'ENTRY',
        price: data[i].close,
        reason: 'RSI oversold + Price above SMA'
      });
      position = true;
    } else if (position && (rsi[i] > 70 || data[i].close < sma[i])) {
      signals.push({
        timestamp: data[i].timestamp,
        type: 'EXIT',
        price: data[i].close,
        reason: 'RSI overbought or Price below SMA'
      });
      position = false;
    }
  }

  return signals;
}

export function calculateReturns(signals: Signal[]): number[] {
  return signals.reduce((acc, signal, i) => {
    if (signal.type === 'EXIT' && i > 0) {
      const entry = signals[i - 1];
      const return_ = (signal.price - entry.price) / entry.price;
      acc.push(return_);
    }
    return acc;
  }, [] as number[]);
}