import express from 'express';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../controllers/staffAssignmentController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, role('admin'));
router.get('/', getAssignments);
router.post('/', createAssignment);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
