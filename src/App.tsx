import React, { useState } from 'react';
import { StrategyBuilder } from './components/StrategyBuilder';
import ReactDOM from 'react-dom/client';
import CSVReader from 'react-csv-reader';

// Mock data for demonstration
const mockInstrument = {
  symbol: 'AAPL',
  data: Array.from({ length: 252 }, (_, i) => ({
    timestamp: Date.now() - (252 - i) * 24 * 60 * 60 * 1000,
    open: 150 + Math.random() * 10,
    high: 155 + Math.random() * 10,
    low: 145 + Math.random() * 10,
    close: 152 + Math.random() * 10,
    volume: 1000000 + Math.random() * 500000
  }))
};

function App() {
  const [instrumentData, setInstrumentData] = useState(mockInstrument.data);

  // Handle CSV file upload and parse the data
  const handleFileUpload = (data: any) => {
    const parsedData = data.map((row: any) => ({
      timestamp: new Date(row.timestamp).getTime(),
      open: parseFloat(row.open),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      close: parseFloat(row.close),
      volume: parseInt(row.volume, 10),
    }));
    setInstrumentData(parsedData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-center text-2xl font-semibold my-4">CSV Data Upload</h1>
      <div className="p-4">
        <CSVReader onFileLoaded={handleFileUpload} />
        <StrategyBuilder instrument={{ ...mockInstrument, data: instrumentData }} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
