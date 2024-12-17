import React from 'react';
import { LineChart } from 'lucide-react';
import { OHLCV } from '../types/trading';
import { MLStrategy } from '../services/mlStrategy';

interface Props {
  data: OHLCV[];
  lookbackPeriod?: number;
  volatilityWindow?: number;
}

export function MLStrategyAnalysis({ 
  data, 
  lookbackPeriod = 20, 
  volatilityWindow = 20 
}: Props) {
  const [analysis, setAnalysis] = React.useState<ReturnType<MLStrategy['analyze']> | null>(null);

  const runAnalysis = () => {
    const strategy = new MLStrategy(data, lookbackPeriod, volatilityWindow);
    const result = strategy.analyze();
    setAnalysis(result);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LineChart className="w-6 h-6" />
          ML Strategy Analysis
        </h2>
        <button
          onClick={runAnalysis}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Run Analysis
        </button>
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Strategy Metrics</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Sharpe Ratio</dt>
                  <dd className="font-medium">{analysis.metrics.sharpeRatio.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Latest Volatility</dt>
                  <dd className="font-medium">
                    {(analysis.metrics.volatility[analysis.metrics.volatility.length - 1] * 100).toFixed(2)}%
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Recent Signals</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analysis.signals.slice(-5).map((signal, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(signal.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          signal.action === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {signal.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${signal.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}