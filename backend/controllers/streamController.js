import { Announcement } from '../models/Announcement.js';
import { Classroom } from '../models/Classroom.js';
import { Notification } from '../models/Notification.js';
import { ClassMember } from '../models/ClassMember.js';

// @route POST /api/stream/:classroomId/announcements
export const createAnnouncement = async (req, res) => {
  try {
    const { content, isScheduled, scheduledFor } = req.body;
    const { classroomId } = req.params;

    const attachments = req.files
      ? req.files.map((file) => ({
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          fileType: file.mimetype,
        }))
      : [];

    const announcement = await Announcement.create({
      classroom: classroomId,
      author: req.user._id,
      content,
      attachments,
      isScheduled: isScheduled || false,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      isPublished: !isScheduled,
    });

    const populated = await Announcement.findById(announcement._id).populate('author', 'name profilePhoto role');

    // Send notifications to class students if published immediately
    if (!isScheduled) {
      const members = await ClassMember.find({ classroom: classroomId, role: 'STUDENT' });
      const classroom = await Classroom.findById(classroomId);

      const notifications = members.map((m) => ({
        user: m.user,
        title: `New Announcement in ${classroom.name}`,
        message: `${req.user.name}: "${content.substring(0, 80)}${content.length > 80 ? '...' : ''}"`,
        type: 'ANNOUNCEMENT_POSTED',
        link: `/classroom/${classroomId}`,
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(201).json({ success: true, announcement: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/stream/:classroomId/announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      classroom: req.params.classroomId,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePhoto role')
      .populate('comments.author', 'name profilePhoto role');

    res.json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/stream/announcements/:id/comments
export const addCommentToAnnouncement = async (req, res) => {
  try {
    const { text } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });

    announcement.comments.push({
      author: req.user._id,
      text,
    });

    await announcement.save();

    const updated = await Announcement.findById(req.params.id)
      .populate('author', 'name profilePhoto role')
      .populate('comments.author', 'name profilePhoto role');

    res.json({ success: true, comments: updated.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
