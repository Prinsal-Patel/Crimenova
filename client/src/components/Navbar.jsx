import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Map, BarChart3, Brain, Phone, Menu, X, LogOut, User } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { loginWithGoogle } from '../api/authApi';

const links = [
  { to: '/', label: 'Home', icon: Shield },
  { to: '/map', label: 'Crime Map', icon: Map },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/prediction', label: 'Prediction', icon: Brain },
  { to: '/emergency', label: 'Emergency', icon: Phone },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const [profileDropdown, setProfileDropdown] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const data = await loginWithGoogle(decoded);
      login(data.user, data.token);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Shield size={26} />
        <span>Crimenova</span>
      </Link>
      <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
        {open ? <X size={24} color="#94a3b8" /> : <Menu size={24} color="#94a3b8" />}
      </button>
      <div className={`navbar-links ${open ? 'open' : ''}`}>
        {links.map(link => {
          if (link.to === '/dashboard' && (!user || (user.role !== 'Police' && user.role !== 'Admin'))) {
            return null; // Hide dashboard for non-Police/Admin
          }
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${pathname === link.to ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}

        {user ? (
          <div className="nav-profile-container" style={{ position: 'relative', marginLeft: '1rem' }}>
            <button 
              className="nav-profile-btn"
              onClick={() => setProfileDropdown(!profileDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <img src={user.picture} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
            </button>
            
            {profileDropdown && (
              <div 
                className="profile-dropdown glass-card" 
                style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', padding: '0.5rem', minWidth: '150px', zIndex: 1000 }}
              >
                <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                </div>
                <button 
                  onClick={() => { logout(); setProfileDropdown(false); setOpen(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem', background: 'transparent', color: 'var(--accent-red)', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', borderRadius: '4px' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginLeft: '1rem' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Login Failed')}
              theme="filled_black"
              shape="pill"
            />
          </div>
        )}
      </div>
    </nav>
  );
}
