import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Settings } from 'lucide-react';

// Simulated strategy performance metrics
const strategySummary = {
  totalReturn: 45.6,
  sharpeRatio: 1.8,
  maxDrawdown: -12.3,
  winRate: 62.5,
  annualizedVolatility: 18.2
};

// Mock trading signals generation function
const generateTradingSignals = (priceData: any[]) => {
  return priceData.map((point, index) => {
    // Simple moving average crossover strategy
    const shortMA = 20;
    const longMA = 50;

    const signal = index >= longMA 
      ? (point.closeMA20 > point.closeMA50 ? 'BUY' : 
         point.closeMA20 < point.closeMA50 ? 'SELL' : 'HOLD')
      : 'INSUFFICIENT_DATA';

    return {
      ...point,
      signal
    };
  });
};

// Strategy Performance Component
const StrategyPerformance = ({ summary }: { summary: typeof strategySummary }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-4 flex items-center">
      <TrendingUp className="mr-2 text-blue-600" /> Strategy Performance
    </h2>
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(summary).map(([key, value]) => (
        <div key={key} className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
          <p className="text-lg font-semibold">{value}%</p>
        </div>
      ))}
    </div>
  </div>
);

// Trading Signals Component
const TradingSignals = ({ signals }: { signals: any[] }) => {
  const filteredSignals = signals.filter(s => s.signal !== 'INSUFFICIENT_DATA');
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <AlertCircle className="mr-2 text-yellow-600" /> Trading Signals
      </h2>
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Signal</th>
            </tr>
          </thead>
          <tbody>
            {filteredSignals.slice(-10).map((signal, idx) => (
              <tr key={idx} className={`
                ${signal.signal === 'BUY' ? 'bg-green-50' : 
                  signal.signal === 'SELL' ? 'bg-red-50' : 'bg-white'}
              `}>
                <td className="p-2">{signal.date}</td>
                <td className="p-2">{signal.close.toFixed(2)}</td>
                <td className="p-2 font-bold">
                  {signal.signal === 'BUY' ? 
                    <span className="text-green-600">▲ {signal.signal}</span> : 
                    <span className="text-red-600">▼ {signal.signal}</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Price Chart Component
const PriceChart = ({ data }: { data: any[] }) => (
  <div className="bg-white p-4 rounded-lg shadow-md h-96">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#8884d8" name="Close Price" />
        <Line type="monotone" dataKey="closeMA20" stroke="#82ca9d" name="20-Day MA" />
        <Line type="monotone" dataKey="closeMA50" stroke="#ffc658" name="50-Day MA" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Main Dashboard Component
const TrendFollowingDashboard = () => {
  const [instrument, setInstrument] = useState<string>('AAPL');
  
  // Mock price data with moving averages
  const mockPriceData = useMemo(() => {
    const baseData = Array.from({ length: 200 }, (_, i) => ({
      date: `2020-${String(Math.floor(i/30) + 1).padStart(2, '0')}-${String(i%30 + 1).padStart(2, '0')}`,
      close: 150 + Math.sin(i * 0.1) * 50,
      open: 150 + Math.sin(i * 0.1) * 50 - 5,
      high: 150 + Math.sin(i * 0.1) * 50 + 5,
      low: 150 + Math.sin(i * 0.1) * 50 - 10
    }));

    // Calculate moving averages
    return baseData.map((point, index, arr) => ({
      ...point,
      closeMA20: index >= 20 ? 
        arr.slice(index - 20, index).reduce((sum, p) => sum + p.close, 0) / 20 : 
        point.close,
      closeMA50: index >= 50 ? 
        arr.slice(index - 50, index).reduce((sum, p) => sum + p.close, 0) / 50 : 
        point.close
    }));
  }, []);

  const tradingSignals = useMemo(() => generateTradingSignals(mockPriceData), [mockPriceData]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <TrendingUp className="mr-3 text-blue-700" /> 
        Alpha Strategy: Trend Detection Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PriceChart data={mockPriceData} />
        </div>
        
        <StrategyPerformance summary={strategySummary} />
        
        <div className="md:col-span-2">
          <TradingSignals signals={tradingSignals} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Settings className="mr-2 text-gray-600" /> Strategy Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Instrument</label>
              <select 
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option>AAPL</option>
                <option>GOOGL</option>
                <option>MSFT</option>
                <option>AMZN</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Strategy Type</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                defaultValue="MovingAverageCrossover"
              >
                <option value="MovingAverageCrossover">Moving Average Crossover</option>
                <option value="MeanReversion">Mean Reversion</option>
                <option value="MachineLearning">Machine Learning</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendFollowingDashboard;