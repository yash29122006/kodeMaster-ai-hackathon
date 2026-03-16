import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { heatmapPoints } from '../../data/mockData';

const MAP_CENTER = [19.0760, 72.8777];

export default function MiniMap() {
    const containerRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current || !containerRef.current) return;

        const map = L.map(containerRef.current, {
            center: MAP_CENTER,
            zoom: 11,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Add glowing orange circle markers
        heatmapPoints.forEach((p) => {
            const size = Math.max(4, p.weight * 0.6);
            L.circleMarker([p.lat, p.lng], {
                radius: size,
                color: 'transparent',
                fillColor: '#fb923c',
                fillOpacity: 0.8,
                className: 'glow-marker-circle',
            }).addTo(map);
        });

        mapRef.current = map;
        setTimeout(() => map.invalidateSize(), 100);

        return () => { map.remove(); mapRef.current = null; };
    }, []);

    return (
        <div className="relative w-full h-full">
            <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />
            {/* Severity legend */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 z-[400]">
                {['Low', 'Med', 'High', 'Severity'].map((l, i) => (
                    <div key={l} className="flex items-center gap-1">
                        {i < 3 && (
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: i === 0 ? '#22d3ee' : i === 1 ? '#f59e0b' : '#ef4444',
                                }}
                            />
                        )}
                        <span className="text-[8px] text-neutral-500">{l}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
