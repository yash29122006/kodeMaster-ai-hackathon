import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Overview from './pages/Overview';
import AccidentLog from './pages/AccidentLog';
import Analytics from './pages/Analytics';
import Heatmap from './pages/Heatmap';
import ResponseTracker from './pages/ResponseTracker';
import AIPerformance from './pages/AIPerformance';

const pageTitles = {
    '/': 'Overview',
    '/accident-log': 'Accident Log',
    '/analytics': 'Analytics',
    '/heatmap': 'Heatmap',
    '/response-tracker': 'Response Tracker',
    '/ai-performance': 'AI Performance',
};

export default function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-[45] lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content — shifts right when sidebar is open on desktop */}
            <div
                className={`flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-52' : 'ml-0'
                    }`}
            >
                <Navbar
                    pageTitles={pageTitles}
                    onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-dark-bg">
                    <div className={`mx-auto transition-all duration-300 ${sidebarOpen ? 'max-w-full' : 'max-w-[1400px]'}`}>
                        <Routes>
                            <Route path="/" element={<Overview />} />
                            <Route path="/accident-log" element={<AccidentLog />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/heatmap" element={<Heatmap />} />
                            <Route path="/response-tracker" element={<ResponseTracker />} />
                            <Route path="/ai-performance" element={<AIPerformance />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
}
