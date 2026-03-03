import express from 'express';
import { login, register, adminLogin, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/login', login);
router.post('/register', register);
router.post('/admin/login', adminLogin);
router.get('/me', protect, getMe);

export default router;
