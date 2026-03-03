import express from 'express';
import {
  getMyNotifications,
  markRead,
  getUnreadCount,
  getAllNotifications,
  createNotification,
} from '../controllers/notificationController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, getMyNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/mark-read', protect, markRead);
router.get('/all', protect, role('admin'), getAllNotifications);
router.post('/', protect, role('admin'), createNotification);

export default router;
