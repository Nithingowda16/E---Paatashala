import express from 'express';
import { getAdminStats, getAllUsers, updateUserStatus, getActivityLogs } from '../controllers/adminController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/logs', getActivityLogs);

export default router;
