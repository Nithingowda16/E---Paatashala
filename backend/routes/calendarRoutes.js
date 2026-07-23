import express from 'express';
import { getCalendarEvents } from '../controllers/calendarController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', getCalendarEvents);

export default router;
