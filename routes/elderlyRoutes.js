import express from 'express';
import {
  getElderly,
  getAssignedElderly,
  getOneElderly,
  createElderly,
  updateElderly,
  deleteElderly,
} from '../controllers/elderlyController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, getElderly);
router.get('/assigned', protect, role('staff'), getAssignedElderly);
router.get('/:id', protect, getOneElderly);
router.post('/', protect, role('admin', 'family'), createElderly);
router.put('/:id', protect, role('admin'), updateElderly);
router.delete('/:id', protect, role('admin'), deleteElderly);

export default router;
