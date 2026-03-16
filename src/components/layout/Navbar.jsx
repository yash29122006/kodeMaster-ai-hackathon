import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, PanelLeftOpen, PanelLeftClose, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ pageTitles, onMenuToggle, sidebarOpen }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <header className="h-14 bg-dark-bg flex items-center justify-between px-4 md:px-6 flex-shrink-0 relative z-[40]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-primary hover:bg-dark-hover transition-colors"
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
        <h2 className="text-base font-bold text-primary">Accident Detection Dashboard</h2>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-xs text-secondary">
          {dateStr} | {timeStr}, Mumbai
        </span>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-neutral-500 hover:text-primary hover:bg-dark-hover transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
        </button>
        <button className="relative p-1.5">
          <Bell size={18} strokeWidth={1.8} className="text-neutral-500" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
