import express from 'express';
import {
  getStaff,
  getOneStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from '../controllers/staffController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, role('admin'));
router.get('/', getStaff);
router.get('/:id', getOneStaff);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
