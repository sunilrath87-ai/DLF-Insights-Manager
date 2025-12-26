
import React from 'react';
import { GroundingSource } from '../types';

const governanceSources = [
  { name: 'Reputed National & Business News Publications', description: 'Major newspapers and digital media outlets with dedicated real estate and business sections.', examples: ['The Economic Times', 'Business Standard', 'Livemint', 'The Hindu BusinessLine'] },
  { name: 'Industry Research Firms', description: 'Specialized firms providing in-depth real estate market analysis, reports, and data.', examples: ['Knight Frank', 'JLL', 'CBRE', 'Anarock'] },
  { name: 'Regulatory Filings / Official Announcements', description: 'Information disclosed through official channels like RERA websites and company press releases.', examples: ['State RERA Portals', 'Stock Exchange Filings (BSE/NSE)', 'Official Developer Press Releases'] },
  { name: 'Institutional Real Estate Reports', description: 'Comprehensive reports published by financial institutions and real estate bodies.', examples: ['Reports by HDFC Capital', 'CREDAI', 'NAREDCO'] },
];

interface SourcesProps {
  marketSources: GroundingSource[];
  competitiveSources: GroundingSource[];
  sharePriceSources: GroundingSource[];
  indiaNewsSources: GroundingSource[];
  internationalNewsSources: GroundingSource[];
}

const Sources: React.FC<SourcesProps> = ({ 
  marketSources, 
  competitiveSources,
  sharePriceSources,
  indiaNewsSources,
  internationalNewsSources
}) => {
  const allSources = [
    ...marketSources, 
    ...competitiveSources,
    ...sharePriceSources,
    ...indiaNewsSources,
    ...internationalNewsSources
  ];
  const uniqueSources = Array.from(new Map(allSources.map(s => [s.web?.uri, s])).values())
    .filter(s => s?.web?.uri && s?.web?.title);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-100 mb-2 border-b-2 border-violet-500/30 pb-3">Live Data Sources</h2>
        <p className="mb-6 text-slate-400">
          The following web sources were used by Gemini to generate the content across all intelligence pages.
        </p>
        {uniqueSources.length > 0 ? (
          <div className="overflow-x-auto bg-slate-800 rounded-lg border border-slate-700">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Source Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {uniqueSources.map((source, index) => (
                  <tr key={index} className="hover:bg-slate-700/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-normal">
                      <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-violet-400 hover:underline">
                        {source.web.title}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                        {source.web.uri}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 bg-slate-800 p-4 rounded-lg">No specific web sources were cited for the current data.</p>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-bold text-slate-100 mb-2 border-b-2 border-violet-500/30 pb-3">Data Source Governance</h2>
        <p className="mb-6 text-slate-400">
          To ensure the highest level of accuracy and neutrality, the DLF Insights Manager platform relies exclusively on authentic, credible, and publicly verifiable sources. We strictly filter out promotional, speculative, and unverified content.
        </p>
        <div className="overflow-x-auto bg-slate-800 rounded-lg border border-slate-700">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Source Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Examples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {governanceSources.map(source => (
                  <tr key={source.name} className="hover:bg-slate-700/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-normal text-sm font-semibold text-violet-400">{source.name}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-slate-300">{source.description}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-slate-400">{source.examples.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default Sources;