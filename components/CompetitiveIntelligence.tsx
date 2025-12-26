
import React from 'react';
import { ProjectLaunch } from '../types';

interface CompetitiveIntelligenceProps {
  data: ProjectLaunch[] | null;
}

const CompetitiveIntelligence: React.FC<CompetitiveIntelligenceProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-slate-400">No recent project launches found.</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b-2 border-violet-500/30 pb-3">New Launch Tracker (Last 90 Days)</h2>
      <div className="overflow-x-auto bg-slate-800 rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Developer & Project</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Configuration & Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Key USP</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Launch Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {data.map((project, index) => (
              <tr key={index} className="hover:bg-slate-700/50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-violet-400">{project.developerName}</div>
                  <div className="text-sm text-slate-300">{project.projectName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{project.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-200">{project.configuration}</div>
                  <div className="text-sm text-slate-400">{project.priceBracket}</div>
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-slate-400 max-w-xs">{project.usp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">{project.launchDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetitiveIntelligence;
