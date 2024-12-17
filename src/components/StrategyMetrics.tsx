import React from 'react';
import { StrategyResult } from '../types/trading';

interface Props {
  metrics: StrategyResult['metrics'];
}

export function StrategyMetrics({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-600">Sharpe Ratio</dt>
            <dd className="font-medium">{metrics.sharpeRatio.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Max Drawdown</dt>
            <dd className="font-medium">{(metrics.maxDrawdown * 100).toFixed(2)}%</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Total Return</dt>
            <dd className="font-medium">{(metrics.totalReturn * 100).toFixed(2)}%</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Win Rate</dt>
            <dd className="font-medium">{(metrics.winRate * 100).toFixed(2)}%</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}