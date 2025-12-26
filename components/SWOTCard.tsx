
import React from 'react';

interface SWOTCardProps {
  title: 'Strengths' | 'Weaknesses' | 'Opportunities' | 'Threats';
  items: string[];
  icon: React.ReactElement;
  colorClass: string;
  gradientClass: string;
}

const renderWithBold = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-slate-100">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

const SWOTCard: React.FC<SWOTCardProps> = ({ title, items, icon, colorClass, gradientClass }) => {
  return (
    <div className={`bg-slate-800 rounded-xl p-5 shadow-lg border-t-4 ${colorClass} ${gradientClass} transition-all duration-300 hover:shadow-violet-500/20 hover:-translate-y-1`}>
      <div className="flex items-center mb-4">
        <div className="mr-4 text-3xl">{icon}</div>
        <h3 className="text-xl font-bold text-slate-100">{title}</h3>
      </div>
      <ul className="space-y-2.5 text-sm text-slate-400 list-disc list-inside">
        {items.map((item, index) => (
          <li key={index} className="leading-relaxed">{renderWithBold(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default SWOTCard;
