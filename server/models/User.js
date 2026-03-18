import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String },
  role: { type: String, enum: ['User', 'Admin'], default: 'User' },
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
