import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { fetchCrimes } from '../api/crimeApi';
import { crimeTypes_list, cities_list } from '../data/crimeData';

/* Heatmap layer component */
function HeatmapLayer({ points }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }
    if (points.length > 0) {
      layerRef.current = L.heatLayer(points, {
        radius: 25,
        blur: 18,
        maxZoom: 14,
        gradient: { 0.2: '#10b981', 0.5: '#f59e0b', 0.8: '#ef4444', 1: '#dc2626' }
      }).addTo(map);
    }
    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current);
    };
  }, [map, points]);

  return null;
}

const severityColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

export default function CrimeMapPage() {
  const [crimes, setCrimes] = useState([]);
  const [filters, setFilters] = useState({ type: '', severity: '', city: '' });
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCrimes(filters).then(data => {
      setCrimes(data);
      setLoading(false);
    });
  }, [filters]);

  const heatPoints = crimes.map(c => [
    c.latitude, c.longitude,
    c.severity === 'High' ? 1 : c.severity === 'Medium' ? 0.6 : 0.3
  ]);

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="map-page">
      {/* Sidebar */}
      <aside className="map-sidebar">
        <h2>🔍 Filters</h2>

        <div className="filter-group">
          <label>Crime Type</label>
          <select className="filter-select" value={filters.type} onChange={e => handleFilter('type', e.target.value)}>
            <option value="">All Types</option>
            {crimeTypes_list.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Severity</label>
          <select className="filter-select" value={filters.severity} onChange={e => handleFilter('severity', e.target.value)}>
            <option value="">All Levels</option>
            <option value="High">🔴 High</option>
            <option value="Medium">🟠 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label>City</label>
          <select className="filter-select" value={filters.city} onChange={e => handleFilter('city', e.target.value)}>
            <option value="">All Cities</option>
            {cities_list.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showHeatmap} onChange={e => setShowHeatmap(e.target.checked)} />
            Show Heatmap Overlay
          </label>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Showing <strong style={{ color: 'var(--accent-cyan)' }}>{crimes.length}</strong> crimes
        </div>

        <div className="map-legend">
          <h3>Legend</h3>
          <div className="legend-item"><span className="legend-dot legend-dot--high"></span> High Severity</div>
          <div className="legend-item"><span className="legend-dot legend-dot--medium"></span> Medium Severity</div>
          <div className="legend-item"><span className="legend-dot legend-dot--low"></span> Low Severity</div>
        </div>
      </aside>

      {/* Map */}
      <div className="map-container">
        {loading && <div className="loading" style={{ position: 'absolute', zIndex: 999, inset: 0, background: 'rgba(5,10,21,0.7)' }}><div className="spinner"></div>Loading map data...</div>}
        <MapContainer center={[22.5, 78.5]} zoom={5} style={{ width: '100%', height: '100%' }} zoomControl={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {showHeatmap && <HeatmapLayer points={heatPoints} />}
          {crimes.map((crime, i) => (
            <CircleMarker
              key={crime._id || i}
              center={[crime.latitude, crime.longitude]}
              radius={7}
              pathOptions={{
                color: severityColors[crime.severity] || '#f59e0b',
                fillColor: severityColors[crime.severity] || '#f59e0b',
                fillOpacity: 0.7,
                weight: 2
              }}
            >
              <Popup>
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{crime.type}</strong>
                  <p style={{ margin: '4px 0' }}>{crime.description}</p>
                  <p style={{ margin: '2px 0', fontSize: '0.8rem' }}>📍 {crime.area}, {crime.city}</p>
                  <p style={{ margin: '2px 0', fontSize: '0.8rem' }}>📅 {new Date(crime.date).toLocaleDateString()}</p>
                  <span className={`severity-badge severity-badge--${crime.severity?.toLowerCase()}`}>{crime.severity}</span>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
