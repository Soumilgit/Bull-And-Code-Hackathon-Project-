import { OHLCV } from '../types/trading';
import { DataProcessor } from './dataProcessor';

export class MLStrategy {
  private data: OHLCV[];
  private lookbackPeriod: number;
  private volatilityWindow: number;

  constructor(data: OHLCV[], lookbackPeriod: number = 20, volatilityWindow: number = 20) {
    this.data = data;
    this.lookbackPeriod = lookbackPeriod;
    this.volatilityWindow = volatilityWindow;
  }

  public analyze(): {
    signals: { timestamp: number; action: 'BUY' | 'SELL'; price: number }[];
    metrics: {
      volatility: number[];
      returns: number[];
      sharpeRatio: number;
    };
  } {
    const { prices, returns } = DataProcessor.processOHLCVData(this.data);
    const volatility = DataProcessor.calculateVolatility(returns, this.volatilityWindow);
    
    // Generate trading signals based on volatility regime
    const signals = this.generateSignals(prices, volatility);
    
    // Calculate strategy metrics
    const sharpeRatio = this.calculateSharpeRatio(returns);

    return {
      signals,
      metrics: {
        volatility,
        returns,
        sharpeRatio
      }
    };
  }

  private generateSignals(prices: number[], volatility: number[]): {
    timestamp: number;
    action: 'BUY' | 'SELL';
    price: number;
  }[] {
    const signals: { timestamp: number; action: 'BUY' | 'SELL'; price: number }[] = [];
    let position = false;
    
    // Calculate moving averages for trend following
    const shortMA = this.calculateMA(prices, 10);
    const longMA = this.calculateMA(prices, 30);

    for (let i = this.lookbackPeriod; i < prices.length; i++) {
      const currentVolatility = volatility[i] || 0;
      const avgVolatility = this.calculateAvgVolatility(volatility.slice(0, i));
      
      // Generate signals based on volatility regime and trend
      if (!position && currentVolatility < avgVolatility && shortMA[i] > longMA[i]) {
        signals.push({
          timestamp: this.data[i].timestamp,
          action: 'BUY',
          price: prices[i]
        });
        position = true;
      } else if (position && (currentVolatility > avgVolatility * 1.5 || shortMA[i] < longMA[i])) {
        signals.push({
          timestamp: this.data[i].timestamp,
          action: 'SELL',
          price: prices[i]
        });
        position = false;
      }
    }

    return signals;
  }

  private calculateMA(prices: number[], period: number): number[] {
    const ma: number[] = [];
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        ma.push(NaN);
        continue;
      }
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      ma.push(sum / period);
    }
    return ma;
  }

  private calculateAvgVolatility(volatility: number[]): number {
    const validVolatility = volatility.filter(v => !isNaN(v));
    return validVolatility.reduce((a, b) => a + b, 0) / validVolatility.length;
  }

  private calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
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
}