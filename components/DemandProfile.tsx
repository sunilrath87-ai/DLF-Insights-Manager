
import React from 'react';
import { DemandProfile as DemandProfileData } from '../types';

interface DemandProfileProps {
  data: DemandProfileData;
}

const PercentageBar: React.FC<{ label: string, percentage: number }> = ({ label, percentage }) => (
    <div>
        <div className="flex justify-between mb-1 text-sm">
            <span className="text-slate-300 font-medium">{label}</span>
            <span className="text-violet-400 font-mono">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div
                className="bg-violet-600 h-2.5 rounded-full"
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${label} demand`}
            ></div>
        </div>
    </div>
);

const DemandProfile: React.FC<DemandProfileProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-inner">
        <h3 className="text-xl font-bold text-slate-100 mb-4">By Configuration</h3>
        <div className="space-y-4">
            {data.byConfiguration.map(item => (
                <PercentageBar key={item.category} label={item.category} percentage={item.percentage} />
            ))}
        </div>
      </div>
      <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-inner">
        <h3 className="text-xl font-bold text-slate-100 mb-4">By Ticket Size</h3>
         <div className="space-y-4">
            {data.byTicketSize.map(item => (
                <PercentageBar key={item.category} label={item.category} percentage={item.percentage} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default DemandProfile;
