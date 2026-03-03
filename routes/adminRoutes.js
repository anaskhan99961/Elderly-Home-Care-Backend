import express from 'express';
import verificationRoutes from './verificationRoutes.js';

const router = express.Router();
router.use('/verifications', verificationRoutes);

export default router;
