import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ labels, datasets, title, stacked = false, height = 300 }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)';
    const tickColor = isDark ? '#525252' : '#737373';
    const titleColor = isDark ? '#a3a3a3' : '#525252';
    const legendColor = isDark ? '#737373' : '#525252';
    const data = {
        labels,
        datasets: datasets.map((ds) => ({
            label: ds.label,
            data: ds.data,
            backgroundColor: ds.color || '#22d3ee',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 4,
            barPercentage: 0.65,
            categoryPercentage: 0.8,
        })),
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutQuart' },
        plugins: {
            legend: {
                display: datasets.length > 1,
                labels: { color: legendColor, usePointStyle: true, padding: 20, font: { size: 11 } },
            },
            title: {
                display: !!title,
                text: title,
                color: titleColor,
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
        scales: {
            x: {
                stacked,
                grid: { color: gridColor },
                ticks: { color: tickColor, font: { size: 10 } },
            },
            y: {
                stacked,
                grid: { color: gridColor },
                ticks: { color: tickColor, font: { size: 10 } },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="chart-container" style={{ height }}>
            <Bar data={data} options={options} />
        </div>
    );
}
