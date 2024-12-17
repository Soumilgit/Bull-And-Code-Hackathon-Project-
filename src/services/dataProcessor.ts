import { OHLCV } from '../types/trading';

export class DataProcessor {
  static processOHLCVData(data: OHLCV[]): {
    dates: Date[];
    prices: number[];
    returns: number[];
  } {
    const dates = data.map(d => new Date(d.timestamp));
    const prices = data.map(d => d.close);
    const returns = prices.map((price, i) => 
      i === 0 ? 0 : (price - prices[i - 1]) / prices[i - 1]
    ).slice(1);

    return { dates, prices, returns };
  }

  static calculateReturns(prices: number[]): number[] {
    return prices.map((price, i) => 
      i === 0 ? 0 : (price - prices[i - 1]) / prices[i - 1]
    ).slice(1);
  }

  static calculateVolatility(returns: number[], window: number = 20): number[] {
    const volatility: number[] = [];
    for (let i = 0; i < returns.length; i++) {
      if (i < window - 1) {
        volatility.push(NaN);
        continue;
      }
      const windowReturns = returns.slice(i - window + 1, i + 1);
      const std = Math.sqrt(
        windowReturns.reduce((sum, r) => sum + r * r, 0) / window
      );
      volatility.push(std * Math.sqrt(252)); // Annualized volatility
    }
    return volatility;
  }
}