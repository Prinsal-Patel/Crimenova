import { useState } from 'react';
import { Phone, MapPin, Shield, Siren, Heart, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { sendEmergency } from '../api/crimeApi';

/* Fix Leaflet default marker icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const contacts = [
  { label: 'Police', number: '100', icon: Shield, color: 'cyan' },
  { label: 'Ambulance', number: '108', icon: Heart, color: 'red' },
  { label: 'Women Helpline', number: '1091', icon: Phone, color: 'purple' },
  { label: 'Fire', number: '101', icon: Siren, color: 'amber' },
];

export default function EmergencyPage() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState(null); // null | 'locating' | 'sending' | 'sent'
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSOS = () => {
    setStatus('locating');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setStatus(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setLocation(coords);
        setStatus('sending');

        const res = await sendEmergency({
          ...coords,
          type: 'General',
          message: 'Emergency SOS triggered'
        });

        setResponse(res);
        setStatus('sent');
      },
      (err) => {
        setError(`Location error: ${err.message}. Please enable GPS.`);
        setStatus(null);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="page">
      <div className="page-container">
        <div className="emergency-page animate-in">
          <div className="page-header" style={{ textAlign: 'center' }}>
            <h1 className="page-title">🚨 Emergency SOS</h1>
            <p className="page-subtitle">Press the SOS button to share your GPS location with emergency services</p>
          </div>

          {/* SOS Button */}
          <button
            className="sos-button"
            onClick={handleSOS}
            disabled={status === 'locating' || status === 'sending'}
          >
            {status === 'locating' ? '📡' : status === 'sending' ? '⏳' : 'SOS'}
          </button>

          {status === 'locating' && (
            <p style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }}>
              <span className="spinner" style={{ width: 16, height: 16, display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }}></span>
              Getting your location...
            </p>
          )}
          {status === 'sending' && (
            <p style={{ color: 'var(--accent-cyan)' }}>Sending alert to authorities...</p>
          )}
          {error && (
            <div className="glass-card" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', margin: '1rem auto', maxWidth: 500 }}>
              <p style={{ color: 'var(--accent-red)' }}><AlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />{error}</p>
            </div>
          )}

          {/* Success Status */}
          {status === 'sent' && location && (
            <div className="sos-status animate-in">
              <h3>✅ Location Shared Successfully!</h3>
              <p>{response?.message}</p>
              <p style={{ marginTop: '0.5rem' }}>
                <MapPin size={14} style={{ verticalAlign: 'middle' }} /> Coordinates: <strong>{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</strong>
              </p>

              {/* Mini Map */}
              <div className="sos-minimap">
                <MapContainer center={[location.latitude, location.longitude]} zoom={15} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  <Marker position={[location.latitude, location.longitude]}>
                    <Popup>📍 Your Location</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}

          {/* Emergency Contacts */}
          <div className="emergency-contacts">
            {contacts.map(c => (
              <div key={c.number} className={`glass-card contact-card`}>
                <c.icon size={28} style={{ color: `var(--accent-${c.color})` }} />
                <div className="contact-card__number" style={{ color: `var(--accent-${c.color})` }}>
                  <a href={`tel:${c.number}`} style={{ color: 'inherit' }}>{c.number}</a>
                </div>
                <div className="contact-card__label">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
