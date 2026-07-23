import { AIConversation } from '../models/AIConversation.js';
import { askGeminiAI } from '../utils/gemini.js';

// @route POST /api/gemini/chat
export const chatWithGemini = async (req, res) => {
  try {
    const { prompt, conversationId, systemInstruction, contextData } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required.' });
    }

    let conversation;
    if (conversationId) {
      conversation = await AIConversation.findOne({ _id: conversationId, user: req.user._id });
    }

    if (!conversation) {
      conversation = await AIConversation.create({
        user: req.user._id,
        title: prompt.substring(0, 30) + '...',
        messages: [],
        contextData: contextData || '',
      });
    }

    // Save User message
    conversation.messages.push({ role: 'user', content: prompt });

    // Call Gemini AI Utility
    const aiAnswer = await askGeminiAI(prompt, systemInstruction, contextData || conversation.contextData);

    // Save Model message
    conversation.messages.push({ role: 'model', content: aiAnswer });
    await conversation.save();

    res.json({
      success: true,
      conversationId: conversation._id,
      reply: aiAnswer,
      conversation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/gemini/conversations
export const getAIConversations = async (req, res) => {
  try {
    const conversations = await AIConversation.find({ user: req.user._id }).sort({ updatedAt: -1 }).select('title updatedAt messages');
    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/gemini/conversations/:id
export const deleteAIConversation = async (req, res) => {
  try {
    await AIConversation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Conversation deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
