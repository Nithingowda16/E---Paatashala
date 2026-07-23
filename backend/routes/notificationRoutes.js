import express from 'express';
import { getUserNotifications, markNotificationRead, markAllNotificationsRead } from '../controllers/notificationController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', getUserNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllNotificationsRead);

export default router;
