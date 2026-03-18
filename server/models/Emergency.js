import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  type: { type: String, enum: ['Police', 'Ambulance', 'Fire', 'General'], default: 'General' },
  message: String,
  userName: String,
  status: { type: String, enum: ['Active', 'Responded', 'Resolved'], default: 'Active' },
  respondedAt: Date,
  resolvedAt: Date
}, { timestamps: true });

export default mongoose.model('Emergency', emergencySchema);
