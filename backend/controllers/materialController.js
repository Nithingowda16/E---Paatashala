import { Material } from '../models/Material.js';
import { Classroom } from '../models/Classroom.js';
import { Notification } from '../models/Notification.js';
import { ClassMember } from '../models/ClassMember.js';

// @route POST /api/materials/:classroomId
export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, topic, isScheduled, scheduledFor } = req.body;
    const { classroomId } = req.params;

    const attachments = req.files
      ? req.files.map((file) => ({
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          fileType: file.mimetype,
          fileSize: file.size,
        }))
      : [];

    const material = await Material.create({
      classroom: classroomId,
      uploadedBy: req.user._id,
      title,
      description: description || '',
      topic: topic || 'General',
      attachments,
      isScheduled: isScheduled || false,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      isPublished: !isScheduled,
    });

    if (!isScheduled) {
      const members = await ClassMember.find({ classroom: classroomId, role: 'STUDENT' });
      const classroom = await Classroom.findById(classroomId);

      const notifications = members.map((m) => ({
        user: m.user,
        title: `New Material in ${classroom.name}`,
        message: `New study material posted: "${title}"`,
        type: 'MATERIAL_POSTED',
        link: `/classroom/${classroomId}`,
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(201).json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/materials/:classroomId
export const getMaterialsByClassroom = async (req, res) => {
  try {
    const materials = await Material.find({
      classroom: req.params.classroomId,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name profilePhoto');

    res.json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/materials/:id
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this material.' });
    }

    await Material.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Material deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
