export function calculateStats(crimes) {
  const totalCrimes = crimes.length;
  const byType = {};
  const bySeverity = {};
  const byCity = {};
  const byMonth = {};

  crimes.forEach(crime => {
    byType[crime.type] = (byType[crime.type] || 0) + 1;
    bySeverity[crime.severity] = (bySeverity[crime.severity] || 0) + 1;
    byCity[crime.city] = (byCity[crime.city] || 0) + 1;
    const d = new Date(crime.date);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    byMonth[key] = (byMonth[key] || 0) + 1;
  });

  const highRiskZones = crimes.filter(c => c.zone === 'High').length;

  return {
    totalCrimes,
    byType: Object.entries(byType).map(([_id, count]) => ({ _id, count })).sort((a, b) => b.count - a.count),
    bySeverity: Object.entries(bySeverity).map(([_id, count]) => ({ _id, count })),
    byCity: Object.entries(byCity).map(([_id, count]) => ({ _id, count })).sort((a, b) => b.count - a.count),
    byMonth: Object.entries(byMonth).map(([key, count]) => {
      const [year, month] = key.split('-');
      return { _id: { year: parseInt(year), month: parseInt(month) }, count };
    }).sort((a, b) => a._id.year - b._id.year || a._id.month - b._id.month),
    highRiskZones
  };
}

export function predictCrime(crimes, { city, zone } = {}) {
  let filtered = [...crimes];
  if (city) filtered = filtered.filter(c => c.city.toLowerCase().includes(city.toLowerCase()));
  if (zone) filtered = filtered.filter(c => c.zone === zone);

  const monthlyData = {};
  filtered.forEach(crime => {
    const d = new Date(crime.date);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    monthlyData[key] = (monthlyData[key] || 0) + 1;
  });

  const values = Object.values(monthlyData);
  const n = values.length;

  if (n < 2) {
    return { predicted: 0, trend: 'insufficient_data', monthlyData, totalRecords: filtered.length };
  }

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  values.forEach((y, x) => {
    sumX += x; sumY += y; sumXY += x * y; sumX2 += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const predicted = Math.max(0, Math.round(slope * n + intercept));
  const trend = slope > 0.5 ? 'increasing' : slope < -0.5 ? 'decreasing' : 'stable';

  const typeDistribution = {};
  filtered.forEach(c => { typeDistribution[c.type] = (typeDistribution[c.type] || 0) + 1; });

  return {
    predicted,
    trend,
    slope: slope.toFixed(2),
    monthlyData,
    typeDistribution,
    totalRecords: filtered.length
  };
}
