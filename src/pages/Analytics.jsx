import React from 'react';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import {
    getAccidentsByDayOfWeek,
    getAvgResponseTimeByWeek,
    getCausesBreakdown,
    getTopAccidentZones,
    getMonthlySeverity,
} from '../data/mockData';

export default function Analytics() {
    const dayOfWeek = getAccidentsByDayOfWeek();
    const responseTimeTrend = getAvgResponseTimeByWeek(12);
    const causes = getCausesBreakdown();
    const topZones = getTopAccidentZones(5);
    const monthlySeverity = getMonthlySeverity(6);

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-dark-card rounded-xl p-5">
                    <BarChart labels={dayOfWeek.labels}
                        datasets={[{ label: 'Accidents', data: dayOfWeek.data, color: '#22d3ee' }]}
                        title="Accidents by Day of Week" height={280} />
                </div>
                <div className="bg-dark-card rounded-xl p-5">
                    <LineChart labels={responseTimeTrend.labels}
                        datasets={[{ label: 'Avg Response (s)', data: responseTimeTrend.data, color: '#f59e0b', fill: true }]}
                        title="Avg Response Time — 12 Weeks" height={280} />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-dark-card rounded-xl p-5">
                    <PieChart labels={Object.keys(causes)} data={Object.values(causes)}
                        colors={['#ef4444', '#f59e0b', '#22d3ee', '#8b5cf6', '#525252']}
                        title="Accident Causes" height={300} />
                </div>
                <div className="bg-dark-card rounded-xl p-5">
                    <BarChart labels={topZones.map((z) => z.zone)}
                        datasets={[{ label: 'Count', data: topZones.map((z) => z.count), color: '#10b981' }]}
                        title="Top 5 Accident-Prone Zones" height={300} />
                </div>
            </div>
            <div className="bg-dark-card rounded-xl p-5">
                <BarChart labels={monthlySeverity.labels}
                    datasets={[
                        { label: 'High', data: monthlySeverity.high, color: '#ef4444' },
                        { label: 'Medium', data: monthlySeverity.medium, color: '#f59e0b' },
                        { label: 'Low', data: monthlySeverity.low, color: '#10b981' },
                    ]}
                    title="Monthly Severity Breakdown" stacked={true} height={300} />
            </div>
        </div>
    );
}
