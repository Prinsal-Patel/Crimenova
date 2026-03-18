import express from 'express';
import {
  getAllCrimes,
  getCrimeById,
  getCrimeStats,
  getCrimePrediction,
  createCrime
} from '../controllers/crimeController.js';

const router = express.Router();

router.get('/', getAllCrimes);
router.get('/stats', getCrimeStats);
router.get('/predict', getCrimePrediction);
router.get('/:id', getCrimeById);
router.post('/', createCrime);

export default router;
