import express from 'express';
import { registerUser, loginUser, getCurrentUser, updateProfile, getStudentsList } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateUser, getCurrentUser);
router.put('/profile', authenticateUser, updateProfile);
router.get('/students', authenticateUser, getStudentsList);

export default router;
