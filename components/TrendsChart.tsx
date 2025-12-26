
import React, { useState } from 'react';
import { TrendDataPoint } from '../types';

interface TrendsChartProps {
  data: TrendDataPoint[];
}

const TrendsChart: React.FC<TrendsChartProps> = ({ data }) => {
    const [tooltip, setTooltip] = useState<{ visible: boolean, x: number, y: number, data: TrendDataPoint | null }>({ visible: false, x: 0, y: 0, data: null });
  
    if (!data || data.length === 0) {
        return <div className="text-slate-400">No trend data available.</div>;
    }

    const PADDING = { top: 20, right: 50, bottom: 30, left: 50 };
    const WIDTH = 500;
    const HEIGHT = 250;
    const CHART_WIDTH = WIDTH - PADDING.left - PADDING.right;
    const CHART_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;

    const maxPrice = Math.max(...data.map(d => d.averagePrice)) * 1.1;
    const maxUnits = Math.max(...data.map(d => d.unitsSold)) * 1.1;

    const priceY = (val: number) => CHART_HEIGHT - (val / maxPrice) * CHART_HEIGHT;
    const unitsY = (val: number) => CHART_HEIGHT - (val / maxUnits) * CHART_HEIGHT;
    const x = (index: number) => (index / (data.length - 1)) * CHART_WIDTH;

    const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${priceY(d.averagePrice)}`).join(' ');
    
    const formatPrice = (price: number) => `₹${(price / 1000).toFixed(1)}k`;
    const formatUnits = (units: number) => (units >= 1000 ? `${(units / 1000).toFixed(1)}k` : units.toString());

    const priceGridLines = [0.25, 0.5, 0.75, 1].map(factor => (
        <line
            key={factor}
            x1={0} y1={priceY(maxPrice * factor)}
            x2={CHART_WIDTH} y2={priceY(maxPrice * factor)}
            className="stroke-slate-700" strokeWidth="1" strokeDasharray="2,2"
        />
    ));
     const unitGridLines = [0.25, 0.5, 0.75, 1].map(factor => (
        <text
            key={factor}
            x={CHART_WIDTH + 5} y={unitsY(maxUnits * factor) + 5}
            className="text-xs fill-slate-500"
        >
            {formatUnits(maxUnits * factor)}
        </text>
    ));

    return (
        <div className="relative flex justify-center">
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full max-w-[500px] h-auto">
                <g transform={`translate(${PADDING.left}, ${PADDING.top})`}>
                    {/* Y-Axis (Price) */}
                    <line x1="0" y1="0" x2="0" y2={CHART_HEIGHT} className="stroke-slate-600" />
                    {[0, 0.25, 0.5, 0.75, 1].map(factor => (
                        <text key={factor} x="-10" y={priceY(maxPrice * factor) + 5} textAnchor="end" className="text-xs fill-slate-400">
                           {formatPrice(maxPrice * factor)}
                        </text>
                    ))}
                    <text x="-35" y={CHART_HEIGHT/2} className="text-xs fill-slate-400" transform={`rotate(-90, -35, ${CHART_HEIGHT/2})`}>Avg. Price/sq.ft</text>

                     {/* Y-Axis (Units Sold) */}
                    <line x1={CHART_WIDTH} y1="0" x2={CHART_WIDTH} y2={CHART_HEIGHT} className="stroke-slate-600" />
                    {unitGridLines}
                    <text x={CHART_WIDTH + 35} y={CHART_HEIGHT/2} className="text-xs fill-slate-400" textAnchor="middle" transform={`rotate(90, ${CHART_WIDTH + 35}, ${CHART_HEIGHT/2})`}>Units Sold</text>

                    {/* X-Axis */}
                    <line x1="0" y1={CHART_HEIGHT} x2={CHART_WIDTH} y2={CHART_HEIGHT} className="stroke-slate-600" />
                    {data.map((d, i) => (
                        <text key={d.quarter} x={x(i)} y={CHART_HEIGHT + 20} textAnchor="middle" className="text-xs fill-slate-400">
                            {d.quarter}
                        </text>
                    ))}
                    
                    {/* Grid Lines */}
                    {priceGridLines}

                    {/* Bars (Units Sold) */}
                    {data.map((d, i) => (
                        <rect
                            key={d.quarter}
                            x={x(i) - (CHART_WIDTH / (data.length * 2.5))}
                            y={unitsY(d.unitsSold)}
                            width={(CHART_WIDTH / data.length) / 1.5}
                            height={CHART_HEIGHT - unitsY(d.unitsSold)}
                            className="fill-slate-600/50 hover:fill-slate-500/80 transition-colors"
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltip({ visible: true, x: rect.left + window.scrollX, y: rect.top + window.scrollY, data: d });
                            }}
                            onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
                        />
                    ))}

                    {/* Line (Average Price) */}
                    <path d={linePath} className="stroke-violet-500 fill-none" strokeWidth="2" />
                    {data.map((d, i) => (
                        <circle
                            key={d.quarter}
                            cx={x(i)}
                            cy={priceY(d.averagePrice)}
                            r="4"
                            className="fill-violet-500 stroke-slate-800"
                            strokeWidth="2"
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltip({ visible: true, x: rect.left + window.scrollX, y: rect.top + window.scrollY, data: d });
                            }}
                            onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
                        />
                    ))}
                </g>
            </svg>
            {tooltip.visible && tooltip.data && (
                <div
                  className="absolute z-10 p-2 text-xs text-white bg-slate-900 rounded-md shadow-lg pointer-events-none border border-slate-700 transition-opacity"
                  style={{ top: tooltip.y - 80, left: tooltip.x - 40 }}
                >
                    <div className="font-bold text-center mb-1">{tooltip.data.quarter}</div>
                    <div><span className="text-violet-400">Price:</span> {formatPrice(tooltip.data.averagePrice)}</div>
                    <div><span className="text-slate-400">Units:</span> {tooltip.data.unitsSold.toLocaleString()}</div>
                </div>
            )}
            <div className="absolute bottom-[-20px] left-0 right-0 flex justify-center space-x-6 mt-4 text-xs text-slate-400">
                <div className="flex items-center"><div className="w-3 h-0.5 bg-violet-500 mr-2"></div>Average Price</div>
                <div className="flex items-center"><div className="w-3 h-3 bg-slate-600/50 mr-2 rounded-sm"></div>Units Sold</div>
            </div>
        </div>
    );
};

export default TrendsChart;
