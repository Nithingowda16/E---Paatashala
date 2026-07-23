import { Message } from '../models/Message.js';
import { Classroom } from '../models/Classroom.js';

// @route GET /api/chat/classroom/:classroomId
export const getClassroomMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      classroom: req.params.classroomId,
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .populate('sender', 'name profilePhoto role');

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/chat/direct/:recipientId
export const getDirectMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.recipientId },
        { sender: req.params.recipientId, recipient: req.user._id },
      ],
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name profilePhoto role')
      .populate('recipient', 'name profilePhoto role');

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/chat/send
export const sendMessage = async (req, res) => {
  try {
    const { classroomId, recipientId, content } = req.body;

    const attachments = req.files
      ? req.files.map((file) => ({
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          fileType: file.mimetype,
        }))
      : [];

    const message = await Message.create({
      classroom: classroomId || null,
      recipient: recipientId || null,
      sender: req.user._id,
      content,
      attachments,
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name profilePhoto role')
      .populate('recipient', 'name profilePhoto role');

    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
