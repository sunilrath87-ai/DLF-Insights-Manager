
import React, { useState, useEffect } from 'react';

const messages = [
  'Fetching market intelligence...',
  'Analyzing competitive landscape...',
  'Generating strategic insights...',
  'Compiling executive report...',
];

const LoadingSpinner: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-900 rounded-lg text-white min-h-[400px]">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-violet-500 opacity-20 animate-ping"></div>
        <div className="absolute inset-2 rounded-full bg-violet-600 opacity-30 animate-ping delay-200"></div>
        <div className="absolute inset-4 flex items-center justify-center rounded-full bg-slate-800 border-2 border-violet-500">
          <svg className="w-8 h-8 text-violet-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-slate-300 transition-opacity duration-500 animate-pulse">
          {messages[currentMessageIndex]}
        </p>
        <div className="mt-4 text-sm text-slate-500">DLF Insights Manager</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
