import express from 'express';
import { createUser, getUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, role } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, role('admin'));
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
