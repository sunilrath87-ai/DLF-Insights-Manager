
import React, { useMemo } from 'react';
import { MarketData } from '../types';
import SWOTCard from './SWOTCard';
import KPICard from './KPICard';
import TrendsChart from './TrendsChart';
import DemandProfile from './DemandProfile';

interface MarketIntelligenceProps {
  data: MarketData | null;
}

const renderWithBold = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-violet-400">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({ data }) => {
  if (!data) {
    return <div className="text-center p-8 text-slate-400">No market data available.</div>;
  }

  const { marketOverview, swot, kpis, trends, demandProfile } = data;

  const formattedOverview = useMemo(() => renderWithBold(marketOverview), [marketOverview]);

  const swotConfig = {
      strengths: { icon: <span role="img" aria-label="up-chart">📈</span>, color: 'border-green-500', gradient: 'bg-gradient-to-br from-slate-800 to-green-900/20'},
      weaknesses: { icon: <span role="img" aria-label="down-chart">📉</span>, color: 'border-red-500', gradient: 'bg-gradient-to-br from-slate-800 to-red-900/20'},
      opportunities: { icon: <span role="img" aria-label="light-bulb">💡</span>, color: 'border-blue-500', gradient: 'bg-gradient-to-br from-slate-800 to-blue-900/20'},
      threats: { icon: <span role="img" aria-label="warning">⚠️</span>, color: 'border-yellow-500', gradient: 'bg-gradient-to-br from-slate-800 to-yellow-900/20'},
  };

  return (
    <div className="space-y-10">
      
      {kpis && kpis.length > 0 && (
        <div>
           <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b-2 border-violet-500/30 pb-3">Key Performance Indicators</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map(kpi => <KPICard key={kpi.name} {...kpi} />)}
           </div>
        </div>
      )}

      {trends && trends.length > 0 && (
         <div>
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b-2 border-violet-500/30 pb-3">Price & Sales Velocity Trends</h2>
            <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-inner">
                <TrendsChart data={trends} />
            </div>
         </div>
      )}

      {demandProfile && (
        <div>
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b-2 border-violet-500/30 pb-3">Buyer Demand Profile</h2>
            <DemandProfile data={demandProfile} />
        </div>
      )}
      
      <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-inner">
        <h2 className="text-3xl font-bold text-slate-100 mb-4 border-b-2 border-violet-500/30 pb-3">Synopsis</h2>
        <div className="text-slate-300 leading-relaxed whitespace-pre-line prose prose-invert prose-strong:text-violet-400">{formattedOverview}</div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b-2 border-violet-500/30 pb-3">SWOT Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SWOTCard title="Strengths" items={swot.strengths} icon={swotConfig.strengths.icon} colorClass={swotConfig.strengths.color} gradientClass={swotConfig.strengths.gradient} />
          <SWOTCard title="Weaknesses" items={swot.weaknesses} icon={swotConfig.weaknesses.icon} colorClass={swotConfig.weaknesses.color} gradientClass={swotConfig.weaknesses.gradient} />
          <SWOTCard title="Opportunities" items={swot.opportunities} icon={swotConfig.opportunities.icon} colorClass={swotConfig.opportunities.color} gradientClass={swotConfig.opportunities.gradient} />
          <SWOTCard title="Threats" items={swot.threats} icon={swotConfig.threats.icon} colorClass={swotConfig.threats.color} gradientClass={swotConfig.threats.gradient} />
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;