import express from 'express';
import { startAttendanceSession, markAttendance, getClassroomAttendanceStats } from '../controllers/attendanceController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/sessions', authorizeRoles('TEACHER', 'ADMIN'), startAttendanceSession);
router.post('/mark', markAttendance);
router.get('/classroom/:classroomId', getClassroomAttendanceStats);

export default router;
