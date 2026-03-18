import mongoose from 'mongoose';

const crimeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: String,
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  city: String,
  area: String,
  date: { type: Date, required: true },
  time: String,
  severity: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  zone: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Reported', 'Investigating', 'Resolved'], default: 'Reported' }
}, { timestamps: true });

export default mongoose.model('Crime', crimeSchema);
