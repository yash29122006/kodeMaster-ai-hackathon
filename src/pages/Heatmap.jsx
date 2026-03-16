import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { Eye, EyeOff } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { heatmapPoints, getTopRiskZones } from '../data/mockData';

const MAP_CENTER = [19.0760, 72.8777];
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

export default function Heatmap() {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const topZones = getTopRiskZones(10);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;
    const map = L.map(mapContainerRef.current, { center: MAP_CENTER, zoom: 12, zoomControl: true });
    tileLayerRef.current = L.tileLayer(DARK_TILES, { attribution: '&copy; OSM &copy; CARTO', maxZoom: 19 }).addTo(map);
    const heatData = heatmapPoints.map((p) => [p.lat, p.lng, p.weight]);
    heatLayerRef.current = L.heatLayer(heatData, {
      radius: 35, blur: 15, maxZoom: 17, max: 8,
      gradient: { 0.0: 'rgba(255,255,0,0)', 0.2: '#fde047', 0.4: '#facc15', 0.6: '#f59e0b', 0.8: '#ea580c', 1.0: '#dc2626' },
    }).addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 100);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !heatLayerRef.current) return;
    showHeatmap ? !mapRef.current.hasLayer(heatLayerRef.current) && heatLayerRef.current.addTo(mapRef.current) : mapRef.current.removeLayer(heatLayerRef.current);
  }, [showHeatmap]);

  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    mapRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(isDark ? DARK_TILES : LIGHT_TILES, { attribution: '&copy; OSM &copy; CARTO', maxZoom: 19 }).addTo(mapRef.current);
  }, [isDark]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-5rem)] animate-fade-in">
      <div className="flex-1 relative rounded-xl overflow-hidden min-h-[300px] isolate">
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        <div className="absolute top-3 left-14 flex gap-2 z-[1000]">
          <button onClick={() => setShowHeatmap(!showHeatmap)}
            className="flex items-center gap-1.5 px-3 py-2 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-secondary hover:text-primary transition-colors">
            {showHeatmap ? <EyeOff size={14} /> : <Eye size={14} />}
            {showHeatmap ? 'Hide' : 'Show'}
          </button>
          <button onClick={() => setIsDark(!isDark)}
            className="px-3 py-2 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-secondary hover:text-primary transition-colors">
            {isDark ? 'Light' : 'Dark'}
          </button>
          <button onClick={() => setShowPanel(!showPanel)}
            className="lg:hidden px-3 py-2 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-secondary hover:text-primary transition-colors">
            Zones
          </button>
        </div>
      </div>

      <div className={`${showPanel ? 'flex' : 'hidden'} lg:flex w-full lg:w-72 bg-dark-card rounded-xl flex-col flex-shrink-0 max-h-[50vh] lg:max-h-full`}>
        <div className="px-5 py-4">
          <h3 className="text-sm font-medium text-secondary">High-Risk Zones</h3>
          <p className="text-xs text-faint mt-0.5">By accident frequency</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {topZones.map((zone, idx) => (
            <div key={zone.zone} className="px-5 py-3 flex items-center justify-between hover:bg-dark-hover transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-faint w-5">{idx + 1}</span>
                <div>
                  <p className="text-sm font-medium text-secondary">{zone.zone}</p>
                  <p className="text-xs text-muted">{zone.count} incidents</p>
                </div>
              </div>
              <Badge label={zone.risk} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
