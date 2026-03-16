import React from 'react';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import LineChart from '../components/charts/LineChart';
import MiniMap from '../components/ui/MiniMap';
import {
    getTodayStats,
    getAccidentsPerDay,
    getRecentAlerts,
} from '../data/mockData';

export default function Overview() {
    const stats = getTodayStats();
    const accidentsPerDay = getAccidentsPerDay(30);
    const recentAlerts = getRecentAlerts(5);
    const spark1 = accidentsPerDay.data.slice(-7);
    const spark2 = accidentsPerDay.data.slice(-10, -3);
    const spark3 = accidentsPerDay.data.slice(-14, -7);

    return (
        <div className="space-y-4 animate-fade-in">
            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard label="Total Incidents" value="1,248" trend="+5.2%" trendDir="up" sparkData={spark1} sparkColor="#22d3ee" />
                <KPICard label="Avg. Response Time" value="4.3 min" trend="-0.8%" trendDir="down" sparkData={spark2} sparkColor="#f59e0b" />
                <KPICard label="Active Sensors" value="9,812" trend="99.7% Stable" trendDir="neutral" />
                <KPICard label="False Positives" value="0.9%" trend="-0.3% Improved" trendDir="down" sparkData={spark3} sparkColor="#10b981" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3 bg-dark-card rounded-xl p-5">
                    <LineChart
                        labels={accidentsPerDay.labels}
                        datasets={[{
                            label: 'Incident Count',
                            data: accidentsPerDay.data.map((v) => v * 15 + Math.floor(Math.random() * 10)),
                            color: '#22d3ee',
                            fill: true,
                        }]}
                        title="Incident Trends (Last 30 Days)"
                        height={250}
                    />
                </div>
                <div className="lg:col-span-2 bg-dark-card rounded-xl p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-secondary mb-2">Incident Severity Map</h3>
                    <div className="flex-1 min-h-[220px]">
                        <MiniMap />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Recent Alerts */}
                <div className="lg:col-span-3 bg-dark-card rounded-xl">
                    <div className="px-5 py-3">
                        <h3 className="text-sm font-medium text-secondary">Recent Alerts</h3>
                    </div>
                    <div className="hidden md:grid grid-cols-5 gap-2 px-5 py-2.5 text-[11px] text-faint uppercase tracking-wider">
                        <span>Timestamp</span><span>Event ID</span><span>Vehicle</span><span>Location</span><span>Severity</span>
                    </div>
                    <div>
                        {recentAlerts.map((alert) => (
                            <div key={alert.id} className="px-5 py-3 grid grid-cols-2 md:grid-cols-5 gap-2 items-center rounded-lg hover:bg-blue-500/5 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                <span className="text-xs text-muted font-mono">
                                    {new Date(alert.dateTime).toLocaleString('en-IN', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-xs text-secondary font-mono">{alert.id.replace('ACC-', '030')}</span>
                                <span className="hidden md:block text-xs text-secondary">Vehicle</span>
                                <span className="text-xs text-primary font-medium">{alert.location}</span>
                                <Badge label={alert.severity === 'High' ? 'Critical' : alert.severity === 'Medium' ? 'Major' : alert.severity} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Model Status */}
                <div className="lg:col-span-2 bg-dark-card rounded-xl p-5">
                    <h3 className="text-sm font-medium text-secondary mb-4">AI Model Status</h3>
                    <p className="text-xs text-faint uppercase tracking-wider mb-3">Overview</p>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                        <div>
                            <p className="text-[11px] text-faint">Active Models</p>
                            <p className="text-xl font-bold text-primary">2</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-faint">Accuracy</p>
                            <p className="text-xl font-bold text-primary">98.6%</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-faint">Latency</p>
                            <p className="text-xl font-bold text-primary">45ms</p>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="text-xs text-muted">Training Progress</p>
                            <p className="text-xs text-blue-400">78%</p>
                        </div>
                        <div className="w-full h-2 bg-dark-hover rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '78%' }} />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted">YOLOv8 — Detection</span>
                            <span className="text-xs text-emerald-400 font-medium">Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted">ResNet — Classification</span>
                            <span className="text-xs text-emerald-400 font-medium">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
