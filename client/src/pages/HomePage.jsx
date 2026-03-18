import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Map, BarChart3, Brain, Phone, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';
import StatCard from '../components/StatCard';
import { fetchStats } from '../api/crimeApi';

export default function HomePage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content animate-in">
          <div className="hero-badge">
            <Shield size={14} />
            CRIME INTELLIGENCE PLATFORM
          </div>
          <h1 className="hero-title">
            Analyze. Predict.<br /><span>Protect.</span>
          </h1>
          <p className="hero-desc">
            Crimenova uses real-time crime data visualization and predictive analytics to help communities stay safe. Track crime hotspots, predict trends, and get instant emergency assistance.
          </p>
          <div className="hero-buttons">
            <Link to="/map" className="btn btn-primary">
              <Map size={18} /> Explore Crime Map
            </Link>
            <Link to="/emergency" className="btn btn-danger">
              <Phone size={18} /> Emergency SOS
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              <BarChart3 size={18} /> View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="page-container">
        <div className="stats-grid">
          <StatCard icon={AlertTriangle} value={stats?.totalCrimes || 0} label="Total Crimes Tracked" color="red" delay={0} />
          <StatCard icon={MapPin} value={stats?.highRiskZones || 0} label="High Risk Zones" color="amber" delay={150} />
          <StatCard icon={TrendingUp} value={stats ? `${Math.round((stats.highRiskZones / Math.max(1, stats.totalCrimes)) * 100)}%` : '0%'} label="High Severity Rate" color="cyan" delay={300} />
          <StatCard icon={Shield} value={8} label="Cities Monitored" color="emerald" delay={450} />
        </div>

        {/* Features */}
        <h2 className="page-title" style={{ textAlign: 'center', marginTop: '2rem' }}>Key Features</h2>
        <div className="features-grid">
          <Link to="/map" className="glass-card feature-card">
            <div className="feature-card__icon feature-card__icon--cyan"><Map size={24} /></div>
            <h3>Interactive Crime Map</h3>
            <p>Visualize crime hotspots on a real-time heatmap with color-coded markers showing severity levels across all cities.</p>
          </Link>
          <Link to="/dashboard" className="glass-card feature-card">
            <div className="feature-card__icon feature-card__icon--purple"><BarChart3 size={24} /></div>
            <h3>Analytics Dashboard</h3>
            <p>Comprehensive charts and statistics — crime by type, monthly trends, severity distribution, and area comparisons.</p>
          </Link>
          <Link to="/prediction" className="glass-card feature-card">
            <div className="feature-card__icon feature-card__icon--amber"><Brain size={24} /></div>
            <h3>Crime Prediction</h3>
            <p>AI-powered trend analysis predicts future crime patterns using historical data and linear regression models.</p>
          </Link>
          <Link to="/emergency" className="glass-card feature-card">
            <div className="feature-card__icon feature-card__icon--red"><Phone size={24} /></div>
            <h3>Emergency SOS</h3>
            <p>One-tap SOS button shares your GPS location with police and ambulance for fastest possible response time.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
