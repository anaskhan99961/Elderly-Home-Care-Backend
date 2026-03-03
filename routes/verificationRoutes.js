import express from 'express';
import { getPendingVerifications, setVerification } from '../controllers/verificationController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, role('admin'));
router.get('/', getPendingVerifications);
router.put('/:id', setVerification);

export default router;
