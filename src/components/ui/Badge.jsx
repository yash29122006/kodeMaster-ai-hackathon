import React from 'react';

const colorMap = {
    High: 'bg-red-500/15 text-red-400',
    Critical: 'bg-red-500/15 text-red-400',
    Medium: 'bg-amber-500/15 text-amber-400',
    Major: 'bg-amber-500/15 text-amber-400',
    Low: 'bg-emerald-500/15 text-emerald-400',
    Resolved: 'bg-emerald-500/15 text-emerald-400',
    Active: 'bg-cyan-500/15 text-cyan-400',
    'False Alarm': 'bg-neutral-500/15 text-neutral-500',
    Confirmed: 'bg-emerald-500/15 text-emerald-400',
    Pending: 'bg-amber-500/15 text-amber-400',
};

export default function Badge({ label, pulse = false }) {
    const colors = colorMap[label] || 'bg-neutral-500/15 text-neutral-500';
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${colors}`}>
            {pulse && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />}
            {label}
        </span>
    );
}
