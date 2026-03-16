import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Map,
  Timer,
  Brain,
  X,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/accident-log', label: 'Events', icon: FileText },
  { to: '/analytics', label: 'Reports', icon: BarChart3 },
  { to: '/heatmap', label: 'Heatmap', icon: Map },
  { to: '/response-tracker', label: 'Response', icon: Timer },
  { to: '/ai-performance', label: 'AI Performance', icon: Brain },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-[50]
        w-52 bg-dark-sidebar flex flex-col flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-3-3.87" /><path d="M7 21v-2a4 4 0 0 1 3-3.87" />
            <circle cx="12" cy="7" r="4" /><line x1="12" y1="11" x2="12" y2="17" />
            <line x1="8" y1="21" x2="16" y2="21" />
          </svg>
          <span className="text-sm font-semibold text-primary tracking-tight">AccidentWatch</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 text-muted hover:text-primary">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-muted hover:text-primary hover:bg-dark-hover'
              }`
            }
          >
            <item.icon size={18} strokeWidth={1.8} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-dark-hover flex items-center justify-center">
            <User size={15} className="text-muted" />
          </div>
          <div>
            <p className="text-xs font-medium text-secondary">Admin</p>
            <p className="text-[10px] text-faint">Profile: Alex R.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
