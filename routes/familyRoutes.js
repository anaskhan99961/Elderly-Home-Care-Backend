import express from 'express';
import { getMyElderly, linkElderly, addElderlyAsFamily, updateLink, deleteLink } from '../controllers/familyController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, role('family'));
router.get('/elderly', getMyElderly);
router.post('/elderly/link', linkElderly);
router.post('/elderly/add', addElderlyAsFamily);
router.put('/elderly/link/:id', updateLink);
router.delete('/elderly/link/:id', deleteLink);

export default router;
