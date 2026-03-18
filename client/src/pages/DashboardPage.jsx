import { useEffect, useState } from 'react';
import { BarChart3, AlertTriangle, MapPin, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import { BarChart, LineChart, DoughnutChart } from '../components/CrimeChart';
import { fetchStats } from '../api/crimeApi';

const CHART_COLORS = ['#06b6d4', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#a855f7'];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then(data => { setStats(data); setLoading(false); });
  }, []);

  if (loading) return <div className="page"><div className="loading"><div className="spinner"></div>Loading dashboard...</div></div>;
  if (!stats) return null;

  const barData = {
    labels: stats.byType.map(t => t._id),
    datasets: [{
      label: 'Crimes',
      data: stats.byType.map(t => t.count),
      backgroundColor: CHART_COLORS.slice(0, stats.byType.length),
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lineData = {
    labels: stats.byMonth.map(m => monthLabels[(m._id?.month || m._id) - 1]),
    datasets: [{
      label: 'Monthly Crimes',
      data: stats.byMonth.map(m => m.count),
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#06b6d4',
      pointBorderColor: '#050a15',
      pointBorderWidth: 2,
      pointRadius: 5,
    }]
  };

  const doughnutData = {
    labels: stats.bySeverity.map(s => s._id),
    datasets: [{
      data: stats.bySeverity.map(s => s.count),
      backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
      borderColor: '#050a15',
      borderWidth: 3,
    }]
  };

  return (
    <div className="page">
      <div className="page-container">
        <div className="page-header animate-in">
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="page-subtitle">Comprehensive crime statistics and trend analysis</p>
        </div>

        <div className="stats-grid">
          <StatCard icon={AlertTriangle} value={stats.totalCrimes} label="Total Crimes" color="red" />
          <StatCard icon={MapPin} value={stats.highRiskZones} label="High Risk" color="amber" />
          <StatCard icon={BarChart3} value={stats.byType.length} label="Crime Types" color="cyan" />
          <StatCard icon={TrendingUp} value={stats.byCity.length} label="Cities" color="emerald" />
        </div>

        <div className="charts-grid">
          <div className="glass-card chart-card">
            <h3>📊 Crimes by Type</h3>
            <div className="chart-wrapper"><BarChart data={barData} /></div>
          </div>
          <div className="glass-card chart-card">
            <h3>📈 Monthly Trend</h3>
            <div className="chart-wrapper"><LineChart data={lineData} /></div>
          </div>
          <div className="glass-card chart-card">
            <h3>🎯 Severity Distribution</h3>
            <div className="chart-wrapper"><DoughnutChart data={doughnutData} /></div>
          </div>
          <div className="glass-card chart-card">
            <h3>🏙️ Crime by City</h3>
            <div className="chart-wrapper">
              <table className="data-table">
                <thead><tr><th>City</th><th>Crimes</th><th>Share</th></tr></thead>
                <tbody>
                  {stats.byCity.map(city => (
                    <tr key={city._id}>
                      <td>{city._id}</td>
                      <td>{city.count}</td>
                      <td>{((city.count / stats.totalCrimes) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
