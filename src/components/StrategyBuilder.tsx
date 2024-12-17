import React, { useState } from 'react';
import { LineChart, Settings } from 'lucide-react';
import type { Instrument, StrategyResult } from '../types/trading';
import { calculateSMA, calculateRSI } from '../utils/indicators';
import { 
  calculateSharpeRatio, 
  calculateMaxDrawdown, 
  calculateTotalReturn, 
  calculateWinRate 
} from '../utils/metrics';
import { generateSignals, calculateReturns } from '../utils/signals';
import { StrategyMetrics } from './StrategyMetrics';
import { SignalsTable } from './SignalsTable';
import { MLStrategyAnalysis } from './MLStrategyAnalysis';

interface Props {
  instrument: Instrument;
}

export function StrategyBuilder({ instrument }: Props) {
  const [period, setPeriod] = useState(14);
  const [result, setResult] = useState<StrategyResult | null>(null);

  const runStrategy = () => {
    const prices = instrument.data.map(d => d.close);
    const sma = calculateSMA(prices, period);
    const rsi = calculateRSI(prices, period);
    
    const signals = generateSignals(instrument.data, sma, rsi, period);
    const returns = calculateReturns(signals);

    setResult({
      signals,
      metrics: {
        sharpeRatio: calculateSharpeRatio(returns),
        maxDrawdown: calculateMaxDrawdown(prices),
        totalReturn: calculateTotalReturn(returns),
        winRate: calculateWinRate(returns)
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <LineChart className="w-6 h-6" />
              Alpha Strategy Builder
            </h1>
            <button
              onClick={runStrategy}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Settings className="w-4 h-4" />
              Run Strategy
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Analysis Period
              </label>
              <input
                type="number"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {result && (
            <div className="space-y-6">
              <StrategyMetrics metrics={result.metrics} />
              <SignalsTable signals={result.signals} />
            </div>
          )}
        </div>

        <MLStrategyAnalysis data={instrument.data} />
      </div>
    </div>
  );
}