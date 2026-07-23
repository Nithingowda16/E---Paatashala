import { User } from '../models/User.js';
import { Classroom } from '../models/Classroom.js';
import { Assignment } from '../models/Assignment.js';
import { Meeting } from '../models/Meeting.js';
import { ActivityLog } from '../models/ActivityLog.js';
import fs from 'fs';
import path from 'path';

// @route GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTeachers = await User.countDocuments({ role: 'TEACHER' });
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const totalClassrooms = await Classroom.countDocuments({ isArchived: false });
    const totalAssignments = await Assignment.countDocuments();
    const totalMeetings = await Meeting.countDocuments();

    // Storage calculation
    let uploadStorageBytes = 0;
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      files.forEach((file) => {
        const stats = fs.statSync(path.join(uploadDir, file));
        uploadStorageBytes += stats.size;
      });
    }

    const storageUsageMB = (uploadStorageBytes / (1024 * 1024)).toFixed(2);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalClassrooms,
        totalAssignments,
        totalMeetings,
        storageUsageMB: `${storageUsageMB} MB`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PATCH /api/admin/users/:id/status
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.accountStatus = status;
    await user.save();

    await ActivityLog.create({
      user: req.user._id,
      action: 'ADMIN_UPDATE_USER_STATUS',
      details: `Updated user ${user.email} status to ${status}`,
    });

    res.json({ success: true, message: `User status changed to ${status}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/admin/logs
export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100).populate('user', 'name email role');
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
