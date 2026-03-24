import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import crimeRoutes from './routes/crimeRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/crimes', crimeRoutes);
app.use('/api/emergency', emergencyRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Crimenova API is running', version: '1.0.0' });
});

if (process.env.NODE_ENV === 'production') {
  const clientDistPath = join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    res.sendFile(join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 Crimenova Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api\n`);
});
