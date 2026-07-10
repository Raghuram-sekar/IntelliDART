import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/users';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, authorize(['ADMIN']), getUsers);

// Get user by ID
router.get('/:id', authenticate, getUserById);

// Update user
router.put('/:id', authenticate, updateUser);

// Delete user (admin only)
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteUser);

export default router; 