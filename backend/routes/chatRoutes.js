import express from 'express';
import { getClassroomMessages, getDirectMessages, sendMessage } from '../controllers/chatController.js';
import { authenticateUser } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/classroom/:classroomId', getClassroomMessages);
router.get('/direct/:recipientId', getDirectMessages);
router.post('/send', upload.array('files', 3), sendMessage);

export default router;
