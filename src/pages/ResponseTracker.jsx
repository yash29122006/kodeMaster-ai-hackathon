import React, { useState, useEffect, useRef } from 'react';
import { Ambulance, ShieldCheck, Flame, TrendingUp, TrendingDown } from 'lucide-react';
import LineChart from '../components/charts/LineChart';
import GaugeChart from '../components/charts/GaugeChart';
import { getServiceAvgResponseTime } from '../data/mockData';

const MAX_DATA_POINTS = 20;

export default function ResponseTracker() {
  const [realTimeData, setRealTimeData] = useState(() => {
    const initial = [];
    for (let i = MAX_DATA_POINTS - 1; i >= 0; i--) initial.push({ label: `${i * 3}s ago`, value: Math.floor(Math.random() * 80) + 100 });
    return initial;
  });
  const [systemScore, setSystemScore] = useState(78);
  const serviceData = useRef(getServiceAvgResponseTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => {
        const newVal = Math.max(45, Math.min(300, prev[prev.length - 1].value + Math.floor(Math.random() * 30) - 15));
        const next = [...prev.slice(1), { label: 'now', value: newVal }];
        return next.map((d, i) => ({ ...d, label: i === next.length - 1 ? 'now' : `${(next.length - 1 - i) * 3}s` }));
      });
      setSystemScore((prev) => Math.max(40, Math.min(98, prev + Math.floor(Math.random() * 5) - 2)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const serviceIcons = { Ambulance: Ambulance, Police: ShieldCheck, 'Fire Brigade': Flame };
  const serviceColors = { Ambulance: 'text-red-400 bg-red-500/10', Police: 'text-cyan-400 bg-cyan-500/10', 'Fire Brigade': 'text-orange-400 bg-orange-500/10' };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-dark-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-secondary">Response Time Monitor</h3>
            <span className="flex items-center gap-1.5 text-xs text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" /> Live
            </span>
          </div>
          <LineChart labels={realTimeData.map((d) => d.label)}
            datasets={[{ label: 'Response (s)', data: realTimeData.map((d) => d.value), color: '#22d3ee', fill: true }]}
            height={280} />
        </div>
        <div className="bg-dark-card rounded-xl p-5 flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-secondary mb-4">System Score</h3>
          <GaugeChart score={systemScore} height={200} />
          <p className="text-xs text-muted mt-3">{systemScore >= 80 ? 'Excellent' : systemScore >= 60 ? 'Good' : 'Needs attention'}</p>
        </div>
      </div>

      <div className="bg-dark-card rounded-xl">
        <div className="px-5 py-4">
          <h3 className="text-sm font-medium text-secondary">Service Response Times</h3>
        </div>
        {/* Mobile */}
        <div className="block md:hidden">
          {serviceData.current.map((s) => {
            const Icon = serviceIcons[s.service] || ShieldCheck;
            const colors = serviceColors[s.service] || 'text-muted bg-dark-hover';
            return (
              <div key={s.service} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors}`}><Icon size={17} strokeWidth={1.8} /></div>
                  <div>
                    <p className="text-sm font-medium text-secondary">{s.service}</p>
                    <p className="text-xs text-muted font-mono">{s.avgTime}s</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {s.trend === 'faster' ? <><TrendingDown size={14} className="text-cyan-400" /><span className="text-cyan-400 text-xs">Faster</span></> : <><TrendingUp size={14} className="text-red-400" /><span className="text-red-400 text-xs">Slower</span></>}
                </div>
              </div>
            );
          })}
        </div>
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Service', 'Avg Time', 'Trend', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-faint uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {serviceData.current.map((s) => {
                const Icon = serviceIcons[s.service] || ShieldCheck;
                const colors = serviceColors[s.service] || 'text-muted bg-dark-hover';
                const perf = s.avgTime <= 120 ? { label: 'Excellent', class: 'text-cyan-400' } : s.avgTime <= 180 ? { label: 'Good', class: 'text-amber-400' } : { label: 'Slow', class: 'text-red-400' };
                return (
                  <tr key={s.service} className="hover:bg-dark-hover transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors}`}><Icon size={16} strokeWidth={1.8} /></div>
                        <span className="text-sm font-medium text-secondary">{s.service}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted font-mono text-sm">{s.avgTime}s</td>
                    <td className="px-5 py-3.5">
                      {s.trend === 'faster' ? <div className="flex items-center gap-1"><TrendingDown size={14} className="text-cyan-400" /><span className="text-cyan-400 text-xs">Faster</span></div> : <div className="flex items-center gap-1"><TrendingUp size={14} className="text-red-400" /><span className="text-red-400 text-xs">Slower</span></div>}
                    </td>
                    <td className="px-5 py-3.5"><span className={`text-xs font-medium ${perf.class}`}>{perf.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
