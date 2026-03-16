import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function DoughnutChart({ labels, data: chartData, colors, title, height = 280 }) {
    const data = {
        labels,
        datasets: [
            {
                data: chartData,
                backgroundColor: colors || ['#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderColor: '#0a0a0a',
                borderWidth: 2,
                hoverOffset: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutQuart' },
        cutout: '68%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#737373', usePointStyle: true, padding: 14, font: { size: 11 } },
            },
            title: {
                display: !!title,
                text: title,
                color: '#a3a3a3',
                font: { size: 13, weight: '500' },
                padding: { bottom: 16 },
            },
            tooltip: {
                backgroundColor: '#171717',
                titleColor: '#e5e5e5',
                bodyColor: '#a3a3a3',
                borderColor: '#262626',
                borderWidth: 1,
                cornerRadius: 6,
                padding: 10,
            },
        },
    };

    return (
        <div className="chart-container" style={{ height }}>
            <Doughnut data={data} options={options} />
        </div>
    );
}
