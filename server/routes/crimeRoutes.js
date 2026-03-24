import express from 'express';
import {
  getAllCrimes,
  getCrimeById,
  getCrimeStats,
  getCrimePrediction,
  createCrime
} from '../controllers/crimeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCrimes);
router.get('/stats', getCrimeStats);
router.get('/predict', getCrimePrediction);
router.get('/:id', getCrimeById);
router.post('/', protect, authorize('Police', 'Admin'), createCrime);

export default router;
