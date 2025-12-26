
import React from 'react';
import { SharePrice } from '../types';

interface SharePriceIndexProps {
  data: SharePrice[] | null;
}

const SharePriceIndex: React.FC<SharePriceIndexProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-slate-400">No share price data available.</div>;
  }

  const changeColorClass = {
    increase: 'text-green-400',
    decrease: 'text-red-400',
    neutral: 'text-slate-400',
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b-2 border-violet-500/30 pb-3">Top 10 India Realty Share Prices</h2>
      <div className="overflow-x-auto bg-slate-800 rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Company Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Current Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Day's Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {data.map((stock, index) => (
              <tr key={index} className="hover:bg-slate-700/50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-violet-400">{stock.companyName}</div>
                  <div className="text-sm text-slate-400 font-mono">{stock.stockSymbol}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-slate-200 font-mono">{stock.currentPrice}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold font-mono ${changeColorClass[stock.changeType]}`}>
                  <div>{stock.dayChange}</div>
                  <div>{stock.dayChangePercent}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <p className="text-xs text-slate-500 mt-4 text-center">
        Disclaimer: Stock prices are fetched in near real-time and are for informational purposes only.
      </p>
    </div>
  );
};

export default SharePriceIndex;