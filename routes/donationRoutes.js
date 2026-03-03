import express from 'express';
import { getDonations, createDonation, getMyDonations } from '../controllers/donationController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, role('admin'), getDonations);
router.get('/my', protect, role('donor'), getMyDonations);
router.post('/', protect, role('admin', 'donor'), createDonation);

export default router;
