import React from 'react';

export default function Table({ columns, data, currentPage, totalPages, onPageChange }) {
    return (
        <div className="bg-dark-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className="px-5 py-3 text-left text-xs font-semibold text-faint uppercase tracking-wider whitespace-nowrap">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={row.id || i} className="hover:bg-dark-hover transition-colors">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-5 py-3 text-sm text-secondary whitespace-nowrap">
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3">
                    <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage <= 1}
                        className="px-4 py-2 bg-dark-hover rounded-lg text-sm text-secondary hover:text-primary disabled:opacity-30 transition-colors">
                        Previous
                    </button>
                    <span className="text-xs text-faint">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages}
                        className="px-4 py-2 bg-dark-hover rounded-lg text-sm text-secondary hover:text-primary disabled:opacity-30 transition-colors">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
