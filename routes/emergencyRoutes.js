import express from 'express';
import { getEmergencies, createEmergency, updateEmergency } from '../controllers/emergencyController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, role('admin', 'staff'), getEmergencies);
router.post('/', protect, role('admin', 'staff'), createEmergency);
router.put('/:id', protect, role('admin', 'staff'), updateEmergency);

export default router;
