import express from 'express';
import {
  createAssignment,
  getClassroomAssignments,
  getAssignmentById,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getClassroomGradebook,
} from '../controllers/assignmentController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/:classroomId', authorizeRoles('TEACHER', 'ADMIN'), upload.array('files', 5), createAssignment);
router.get('/classroom/:classroomId', getClassroomAssignments);
router.get('/gradebook/:classroomId', getClassroomGradebook);
router.get('/:id', getAssignmentById);
router.post('/:id/submit', upload.array('files', 5), submitAssignment);
router.get('/:id/submissions', authorizeRoles('TEACHER', 'ADMIN'), getAssignmentSubmissions);
router.post('/:id/grade', authorizeRoles('TEACHER', 'ADMIN'), gradeSubmission);

export default router;
