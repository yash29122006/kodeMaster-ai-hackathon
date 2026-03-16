import React from 'react';

function Sparkline({ data, color = '#22d3ee', width = 70, height = 28 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} className="opacity-60 flex-shrink-0">
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function KPICard({ label, value, trend, trendDir, sparkData, sparkColor }) {
  return (
    <div className="bg-dark-card rounded-xl px-4 py-4 flex items-center justify-between gap-3 min-w-0">
      <div className="min-w-0">
        <p className="text-xs text-muted mb-1 truncate">{label}</p>
        <p className="text-2xl font-bold text-primary leading-tight">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 font-medium ${
            trendDir === 'up' ? 'text-emerald-400' : trendDir === 'down' ? 'text-red-400' : 'text-muted'
          }`}>
            {trend}
          </p>
        )}
      </div>
      {sparkData && <Sparkline data={sparkData} color={sparkColor || '#22d3ee'} />}
    </div>
  );
}
