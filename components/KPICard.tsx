
import React from 'react';
import { KPI } from '../types';

const KPICard: React.FC<KPI> = ({ name, value, change, changeType }) => {
  const config = {
    increase: { icon: '▲', color: 'text-green-400' },
    decrease: { icon: '▼', color: 'text-red-400' },
    neutral: { icon: '–', color: 'text-slate-400' },
  };

  const { icon, color } = config[changeType];

  return (
    <div className="bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-700 transition-all duration-300 hover:shadow-violet-500/20 hover:-translate-y-1">
      <p className="text-sm text-slate-400 mb-1">{name}</p>
      <p className="text-3xl font-bold text-slate-100 mb-2">{value}</p>
      <div className={`flex items-center text-sm font-semibold ${color}`}>
        <span>{icon}</span>
        <span className="ml-1">{change}</span>
      </div>
    </div>
  );
};

export default KPICard;
