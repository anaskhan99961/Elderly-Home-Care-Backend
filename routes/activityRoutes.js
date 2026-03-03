import express from 'express';
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, getActivities);
router.post('/', protect, role('admin', 'staff', 'family'), createActivity);
router.put('/:id', protect, role('admin', 'staff', 'family'), updateActivity);
router.delete('/:id', protect, role('admin', 'staff', 'family'), deleteActivity);

export default router;
