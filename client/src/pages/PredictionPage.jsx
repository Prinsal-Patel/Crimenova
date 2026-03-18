import { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { LineChart, DoughnutChart } from '../components/CrimeChart';
import { fetchPrediction } from '../api/crimeApi';
import { cities_list } from '../data/crimeData';

export default function PredictionPage() {
  const [city, setCity] = useState('');
  const [zone, setZone] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    const data = await fetchPrediction({ city, zone });
    setResult(data);
    setLoading(false);
  };

  const trendIcon = result?.trend === 'increasing' ? <TrendingUp size={24} /> :
    result?.trend === 'decreasing' ? <TrendingDown size={24} /> : <Minus size={24} />;
  const trendClass = result?.trend ? `trend-${result.trend}` : '';

  const monthLabels = Object.keys(result?.monthlyData || {});
  const monthValues = Object.values(result?.monthlyData || {});

  const trendChartData = {
    labels: [...monthLabels, 'Predicted'],
    datasets: [{
      label: 'Crime Count',
      data: [...monthValues, result?.predicted || 0],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: [...monthValues.map(() => '#06b6d4'), '#ef4444'],
      pointRadius: [...monthValues.map(() => 4), 8],
      pointBorderColor: '#050a15',
      pointBorderWidth: 2,
    }]
  };

  const typeLabels = Object.keys(result?.typeDistribution || {});
  const typeValues = Object.values(result?.typeDistribution || {});
  const typeChartData = {
    labels: typeLabels,
    datasets: [{
      data: typeValues,
      backgroundColor: ['#06b6d4', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#a855f7'],
      borderColor: '#050a15',
      borderWidth: 2,
    }]
  };

  /* Risk gauge needle angle: 0deg = low (left), 90deg = high (right) */
  const riskAngle = result ? (
    result.trend === 'increasing' ? -20 :
    result.trend === 'decreasing' ? -70 : -45
  ) : -90;

  return (
    <div className="page">
      <div className="page-container">
        <div className="page-header animate-in">
          <h1 className="page-title">Crime Prediction</h1>
          <p className="page-subtitle">Predict future crime trends using historical data analysis</p>
        </div>

        {/* Controls */}
        <div className="prediction-controls">
          <div className="filter-group" style={{ flex: 1, minWidth: '200px' }}>
            <label>City</label>
            <select className="filter-select" value={city} onChange={e => setCity(e.target.value)}>
              <option value="">All Cities</option>
              {cities_list.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-group" style={{ flex: 1, minWidth: '200px' }}>
            <label>Risk Zone</label>
            <select className="filter-select" value={zone} onChange={e => setZone(e.target.value)}>
              <option value="">All Zones</option>
              <option value="High">🔴 High Risk</option>
              <option value="Medium">🟠 Medium Risk</option>
              <option value="Low">🟢 Low Risk</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" onClick={handlePredict} disabled={loading}>
              <Brain size={18} />
              {loading ? 'Analyzing...' : 'Predict Crime'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            <div className="prediction-result animate-in">
              <div className="glass-card prediction-card">
                <BarChart3 size={28} style={{ color: 'var(--accent-cyan)' }} />
                <div className="prediction-card__value" style={{ color: 'var(--accent-cyan)' }}>{result.predicted}</div>
                <div className="prediction-card__label">Predicted Crimes (Next Month)</div>
              </div>
              <div className="glass-card prediction-card">
                <span className={trendClass}>{trendIcon}</span>
                <div className={`prediction-card__value ${trendClass}`} style={{ fontSize: '1.75rem', textTransform: 'capitalize' }}>{result.trend?.replace('_', ' ')}</div>
                <div className="prediction-card__label">Trend Direction (Slope: {result.slope})</div>
              </div>
              <div className="glass-card prediction-card">
                <div className="risk-gauge">
                  <div className="risk-gauge__bg"></div>
                  <div className="risk-gauge__needle" style={{ transform: `rotate(${riskAngle}deg)` }}></div>
                </div>
                <div className="prediction-card__label">Risk Gauge</div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="glass-card chart-card">
                <h3>📈 Historical + Predicted Trend</h3>
                <div className="chart-wrapper"><LineChart data={trendChartData} /></div>
              </div>
              {typeLabels.length > 0 && (
                <div className="glass-card chart-card">
                  <h3>🎯 Crime Type Distribution</h3>
                  <div className="chart-wrapper"><DoughnutChart data={typeChartData} /></div>
                </div>
              )}
            </div>

            <div className="glass-card" style={{ marginTop: '1.5rem', padding: '1rem 1.5rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                📊 Analysis based on <strong style={{ color: 'var(--accent-cyan)' }}>{result.totalRecords}</strong> historical records using linear regression.
                {city && <> Filtered by city: <strong>{city}</strong>.</>}
                {zone && <> Zone: <strong>{zone}</strong>.</>}
              </p>
            </div>
          </>
        )}

        {!result && !loading && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Brain size={48} style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Select Parameters & Predict</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Choose a city and risk zone, then click "Predict Crime" to see the forecast.</p>
          </div>
        )}
      </div>
    </div>
  );
}
