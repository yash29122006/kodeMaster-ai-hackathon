import React, { useState, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { accidents } from '../data/mockData';

const ROWS_PER_PAGE = 10;

export default function AccidentLog() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return accidents.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch = a.id.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.verifiedBy.toLowerCase().includes(q);
      const matchSeverity = severityFilter === 'All' || a.severity === severityFilter;
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchSearch && matchSeverity && matchStatus;
    });
  }, [search, severityFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const pageData = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleExport = () => {
    const headers = ['ID', 'Date & Time', 'Location', 'Severity', 'Verified By', 'Services', 'Response Time', 'Status'];
    const rows = filtered.map((a) => [a.id, new Date(a.dateTime).toLocaleString('en-IN'), a.location, a.severity, a.verifiedBy, a.servicesNotified.join(', '), `${a.responseTime}s`, a.status]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'accident_log.csv'; link.click();
    URL.revokeObjectURL(url);
  };

  const serviceIcon = (s) => ({ Hospital: '🏥', Police: '🚓', Fire: '🚒' }[s] || '');

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'dateTime', label: 'Date & Time', render: (v) => new Date(v).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { key: 'location', label: 'Location' },
    { key: 'severity', label: 'Severity', render: (v) => <Badge label={v} /> },
    { key: 'verifiedBy', label: 'Verified By' },
    { key: 'servicesNotified', label: 'Services', render: (v) => (
      <div className="flex gap-1">{v.map((s) => <span key={s} className="px-1.5 py-0.5 rounded bg-dark-hover text-xs" title={s}>{serviceIcon(s)}</span>)}{v.length === 0 && <span className="text-faint">—</span>}</div>
    )},
    { key: 'responseTime', label: 'Response', render: (v) => v > 0 ? <span className="font-mono text-muted">{v}s</span> : '—' },
    { key: 'status', label: 'Status', render: (v) => <Badge label={v} pulse={v === 'Active'} /> },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input type="text" placeholder="Search ID, location..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2.5 bg-dark-card rounded-xl text-sm text-primary placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
          </div>
          <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 bg-dark-card rounded-xl text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-blue-500/30">
            <option value="All">All Severity</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 bg-dark-card rounded-xl text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-blue-500/30">
            <option value="All">All Status</option><option value="Resolved">Resolved</option><option value="Active">Active</option><option value="False Alarm">False Alarm</option>
          </select>
        </div>
        <button onClick={handleExport} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 rounded-xl text-sm font-medium transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <p className="text-xs text-faint">{filtered.length} records · Page {page} of {totalPages}</p>

      {/* Mobile card view */}
      <div className="block md:hidden space-y-3">
        {pageData.map((a) => (
          <div key={a.id} className="bg-dark-card rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">{a.id}</span>
              <Badge label={a.status} pulse={a.status === 'Active'} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary">{a.location}</span>
              <Badge label={a.severity} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted">
              <span>{new Date(a.dateTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              <span>{a.responseTime > 0 ? `${a.responseTime}s` : '—'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <Table columns={columns} data={pageData} currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <div className="flex md:hidden items-center justify-between">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="px-4 py-2 bg-dark-card rounded-xl text-sm text-secondary disabled:opacity-30">Previous</button>
        <span className="text-xs text-faint">{page}/{totalPages}</span>
        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="px-4 py-2 bg-dark-card rounded-xl text-sm text-secondary disabled:opacity-30">Next</button>
      </div>
    </div>
  );
}
