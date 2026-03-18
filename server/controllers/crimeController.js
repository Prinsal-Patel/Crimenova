import Crime from '../models/Crime.js';

export const getAllCrimes = async (req, res) => {
  try {
    const { type, severity, city, startDate, endDate } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (city) filter.city = new RegExp(city, 'i');
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const crimes = await Crime.find(filter).sort({ date: -1 });
    res.json(crimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCrimeById = async (req, res) => {
  try {
    const crime = await Crime.findById(req.params.id);
    if (!crime) return res.status(404).json({ message: 'Crime not found' });
    res.json(crime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCrimeStats = async (req, res) => {
  try {
    const totalCrimes = await Crime.countDocuments();
    const byType = await Crime.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const bySeverity = await Crime.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    const byCity = await Crime.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const byMonth = await Crime.aggregate([
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    const highRiskZones = await Crime.countDocuments({ zone: 'High' });
    res.json({ totalCrimes, byType, bySeverity, byCity, byMonth, highRiskZones });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCrimePrediction = async (req, res) => {
  try {
    const { city, zone } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (zone) filter.zone = zone;
    const crimes = await Crime.find(filter).sort({ date: 1 });

    const monthlyData = {};
    crimes.forEach(crime => {
      const key = `${crime.date.getFullYear()}-${crime.date.getMonth() + 1}`;
      monthlyData[key] = (monthlyData[key] || 0) + 1;
    });

    const values = Object.values(monthlyData);
    const n = values.length;
    if (n < 2) {
      return res.json({ predicted: 0, trend: 'insufficient_data', monthlyData, totalRecords: crimes.length });
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
    crimes.forEach(c => { typeDistribution[c.type] = (typeDistribution[c.type] || 0) + 1; });

    res.json({ predicted, trend, slope: slope.toFixed(2), monthlyData, typeDistribution, totalRecords: crimes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCrime = async (req, res) => {
  try {
    const crime = new Crime(req.body);
    const saved = await crime.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
