import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { FloatInfo, QueryParams } from '@/types';

interface TrajectoryMapTabProps {
  floats: FloatInfo[];
  params: QueryParams;
}

export default function TrajectoryMapTab({ floats, params }: TrajectoryMapTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [params.lat, params.lon],
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    const icon = L.divIcon({
      className: '',
      html: '<div class="float-marker"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    floats.forEach((f) => {
      const marker = L.marker([f.lat, f.lon], { icon });
      marker.bindPopup(
        `<div style="font-family: Inter, sans-serif;">
          <div style="font-weight: 600; color: #22d3ee; margin-bottom: 4px;">Float ${f.id}</div>
          <div style="color: #94a3b8; font-size: 11px;">Region: ${f.region}</div>
          <div style="color: #94a3b8; font-size: 11px;">Lat: ${f.lat}°N, Lon: ${f.lon}°E</div>
          <div style="color: #94a3b8; font-size: 11px;">Cycle: ${f.cycle}</div>
        </div>`
      );
      marker.addTo(map);
    });

    // Add query center marker
    const centerIcon = L.divIcon({
      className: '',
      html: '<div style="width: 20px; height: 20px; border: 2px solid #f59e0b; border-radius: 50%; box-shadow: 0 0 12px rgba(245,158,11,0.6); background: rgba(245,158,11,0.15);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    const centerMarker = L.marker([params.lat, params.lon], { icon: centerIcon });
    centerMarker.bindPopup(
      `<div style="font-family: Inter, sans-serif;">
        <div style="font-weight: 600; color: #f59e0b;">Query Center</div>
        <div style="color: #94a3b8; font-size: 11px;">${params.lat}°N, ${params.lon}°E</div>
      </div>`
    );
    centerMarker.addTo(map);

    map.setView([params.lat, params.lon], 5);
  }, [floats, params]);

  return (
    <div className="h-full w-full relative">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-3 glass-strong rounded-lg px-3 py-2 z-[1000] pointer-events-none">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Legend</div>
        <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
          <div className="float-marker" style={{ width: 10, height: 10 }}></div>
          <span>ARGO Float</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div style={{ width: 12, height: 12, border: '2px solid #f59e0b', borderRadius: '50%' }}></div>
          <span>Query Center</span>
        </div>
      </div>
    </div>
  );
}
