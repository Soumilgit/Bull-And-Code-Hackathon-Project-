import { Signal } from '../types/trading';

export function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
  if (returns.length === 0) return 0;
  
  const excessReturns = returns.map(r => r - riskFreeRate / 252);
  const meanExcessReturn = excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length;
  
  if (excessReturns.length <= 1) return 0;
  
  const stdDev = Math.sqrt(
    excessReturns.reduce((a, b) => a + Math.pow(b - meanExcessReturn, 2), 0) / 
    (excessReturns.length - 1)
  );
  
  return stdDev === 0 ? 0 : (meanExcessReturn / stdDev) * Math.sqrt(252);
}

export function calculateMaxDrawdown(prices: number[]): number {
  if (prices.length === 0) return 0;
  
  let maxDrawdown = 0;
  let peak = prices[0];
  
  for (const price of prices) {
    if (price > peak) {
      peak = price;
    }
    const drawdown = (peak - price) / peak;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  }
  
  return maxDrawdown;
}

export function calculateTotalReturn(returns: number[]): number {
  if (returns.length === 0) return 0;
  return returns.reduce((a, b) => (1 + a) * (1 + b) - 1, 0);
}

export function calculateWinRate(returns: number[]): number {
  if (returns.length === 0) return 0;
  return returns.filter(r => r > 0).length / returns.length;
}