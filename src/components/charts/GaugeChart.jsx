import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip);

export default function GaugeChart({ score = 75, height = 200 }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const remaining = 100 - score;

    const scoreColor = isDark ? '#f5f5f5' : '#000000';
    const labelColor = isDark ? '#525252' : '#555555';

    const centerTextPlugin = {
        id: 'centerText',
        afterDraw(chart) {
            const { ctx, width, height: h } = chart;
            const meta = chart.getDatasetMeta(0);
            if (!meta || !meta.data || meta.data.length === 0) return;

            const val = chart.data.datasets[0].data[0];
            ctx.save();
            ctx.textAlign = 'center';

            ctx.font = 'bold 28px Inter, sans-serif';
            ctx.fillStyle = scoreColor;
            ctx.fillText(val, width / 2, h / 2 + 8);

            ctx.font = '11px Inter, sans-serif';
            ctx.fillStyle = labelColor;
            ctx.fillText('Score', width / 2, h / 2 + 28);

            ctx.restore();
        },
    };

    const getColor = (s) => {
        if (s >= 80) return '#22d3ee';
        if (s >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const trackColor = isDark ? '#171717' : '#e5e5e5';

    const data = {
        datasets: [
            {
                data: [score, remaining],
                backgroundColor: [getColor(score), trackColor],
                borderWidth: 0,
                circumference: 240,
                rotation: 240,
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        animation: { duration: 800, easing: 'easeOutQuart' },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    return (
        <div className="chart-container" style={{ height }}>
            <Doughnut key={theme} data={data} options={options} plugins={[centerTextPlugin]} />
        </div>
    );
}
