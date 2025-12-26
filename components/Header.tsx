
import React from 'react';
import { Geography } from '../types';

interface HeaderProps {
  geography: Geography;
  setGeography: (geography: Geography) => void;
  lastUpdated: Date;
}

const Header: React.FC<HeaderProps> = ({ geography, setGeography, lastUpdated }) => {
  const formattedDate = lastUpdated.toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <header className="sticky top-0 z-10 bg-slate-800/50 backdrop-blur-sm shadow-lg border-b border-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-violet-400">DLF Insights Manager</h1>
            <p className="text-sm text-slate-400">Residential Market Intelligence. Simplified.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={geography}
                onChange={(e) => setGeography(e.target.value as Geography)}
                className="appearance-none w-full bg-slate-700 border border-slate-600 text-slate-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-slate-600 focus:border-violet-500 transition shadow-inner"
              >
                {Object.values(Geography).map((geo) => (
                  <option key={geo} value={geo}>
                    {geo}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center sm:text-right text-xs text-slate-500 mt-2">
          Last Updated: {formattedDate} IST
        </div>
      </div>
    </header>
  );
};

export default Header;
