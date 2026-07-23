import express from 'express';
import { scheduleMeeting, getClassroomMeetings, startMeeting, endMeeting, logMeetingJoin } from '../controllers/meetingController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', authorizeRoles('TEACHER', 'ADMIN'), scheduleMeeting);
router.get('/classroom/:classroomId', getClassroomMeetings);
router.post('/:id/start', authorizeRoles('TEACHER', 'ADMIN'), startMeeting);
router.post('/:id/end', authorizeRoles('TEACHER', 'ADMIN'), endMeeting);
router.post('/:meetingId/join-log', logMeetingJoin);

export default router;
