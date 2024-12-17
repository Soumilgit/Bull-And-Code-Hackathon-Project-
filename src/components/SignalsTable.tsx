import React from 'react';
import { Signal } from '../types/trading';

interface Props {
  signals: Signal[];
}

export function SignalsTable({ signals }: Props) {
  return (
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
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {signals.slice(-5).map((signal, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(signal.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    signal.type === 'ENTRY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {signal.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${signal.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {signal.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}