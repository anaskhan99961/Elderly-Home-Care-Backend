import express from 'express';
import {
  getMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from '../controllers/medicalController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, getMedicalRecords);
router.post('/', protect, role('admin', 'staff'), createMedicalRecord);
router.put('/:id', protect, role('admin', 'staff'), updateMedicalRecord);
router.delete('/:id', protect, role('admin', 'staff'), deleteMedicalRecord);

export default router;
