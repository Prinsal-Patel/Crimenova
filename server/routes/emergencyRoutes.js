import express from 'express';
import {
  createEmergency,
  getActiveEmergencies,
  updateEmergencyStatus
} from '../controllers/emergencyController.js';

const router = express.Router();

router.post('/', createEmergency);
router.get('/active', getActiveEmergencies);
router.patch('/:id', updateEmergencyStatus);

export default router;
