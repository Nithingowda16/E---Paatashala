import express from 'express';
import { createAnnouncement, getAnnouncements, addCommentToAnnouncement } from '../controllers/streamController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/:classroomId/announcements', upload.array('files', 5), createAnnouncement);
router.get('/:classroomId/announcements', getAnnouncements);
router.post('/announcements/:id/comments', addCommentToAnnouncement);

export default router;
