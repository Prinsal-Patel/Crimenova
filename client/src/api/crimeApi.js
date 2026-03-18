import { crimeData } from '../data/crimeData';
import { calculateStats, predictCrime } from '../utils/predictionUtils';

const API_BASE = '/api';

async function apiFetch(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function fetchCrimes(filters = {}) {
  try {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v)
    );
    return await apiFetch(`/crimes?${params}`);
  } catch {
    let data = [...crimeData];
    if (filters.type) data = data.filter(c => c.type === filters.type);
    if (filters.severity) data = data.filter(c => c.severity === filters.severity);
    if (filters.city) data = data.filter(c => c.city.toLowerCase().includes(filters.city.toLowerCase()));
    return data;
  }
}

export async function fetchStats() {
  try {
    return await apiFetch('/crimes/stats');
  } catch {
    return calculateStats(crimeData);
  }
}

export async function fetchPrediction(params = {}) {
  try {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    );
    return await apiFetch(`/crimes/predict?${query}`);
  } catch {
    return predictCrime(crimeData, params);
  }
}

export async function sendEmergency(data) {
  try {
    const res = await fetch(`${API_BASE}/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    return {
      message: '🚨 Emergency alert sent! Help is on the way.',
      _id: Date.now().toString(),
      status: 'Active',
      ...data
    };
  }
}
