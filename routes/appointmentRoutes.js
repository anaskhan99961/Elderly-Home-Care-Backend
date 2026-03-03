import express from 'express';
import { getAppointments, createAppointment, updateAppointment } from '../controllers/appointmentController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, getAppointments);
router.post('/', protect, role('family'), createAppointment);
router.put('/:id', protect, updateAppointment);

export default router;
