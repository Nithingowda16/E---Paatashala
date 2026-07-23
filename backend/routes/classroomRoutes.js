import express from 'express';
import {
  createClassroom,
  getUserClassrooms,
  joinClassroomByCode,
  getClassroomById,
  getClassroomMembers,
  removeClassroomMember,
  regenerateClassCode,
} from '../controllers/classroomController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', authorizeRoles('TEACHER', 'ADMIN'), createClassroom);
router.get('/', getUserClassrooms);
router.post('/join', joinClassroomByCode);
router.get('/:id', getClassroomById);
router.get('/:id/members', getClassroomMembers);
router.delete('/:id/members/:userId', removeClassroomMember);
router.post('/:id/regenerate-code', authorizeRoles('TEACHER', 'ADMIN'), regenerateClassCode);

export default router;
