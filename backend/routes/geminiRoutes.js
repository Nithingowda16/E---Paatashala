import express from 'express';
import { chatWithGemini, getAIConversations, deleteAIConversation } from '../controllers/geminiController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/chat', chatWithGemini);
router.get('/conversations', getAIConversations);
router.delete('/conversations/:id', deleteAIConversation);

export default router;
