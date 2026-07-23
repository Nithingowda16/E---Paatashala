import express from 'express';
import { uploadMaterial, getMaterialsByClassroom, deleteMaterial } from '../controllers/materialController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/:classroomId', authorizeRoles('TEACHER', 'ADMIN'), upload.array('files', 10), uploadMaterial);
router.get('/:classroomId', getMaterialsByClassroom);
router.delete('/:id', authorizeRoles('TEACHER', 'ADMIN'), deleteMaterial);

export default router;
