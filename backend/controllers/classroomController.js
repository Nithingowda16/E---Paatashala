import { Classroom } from '../models/Classroom.js';
import { ClassMember } from '../models/ClassMember.js';
import { User } from '../models/User.js';
import { ActivityLog } from '../models/ActivityLog.js';

// Unique Class Code Generator: e.g. CS-AI-7X92
const generateClassCode = (subject) => {
  const prefix = (subject || 'CLASS').substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const randStr = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${prefix}-${randStr}${randNum}`;
};

// @route POST /api/classrooms
export const createClassroom = async (req, res) => {
  try {
    const { name, subject, section, room, description, academicYear } = req.body;
    const classCode = generateClassCode(subject);

    const classroom = await Classroom.create({
      name,
      subject,
      section: section || 'A',
      room: room || 'Main Hall',
      description: description || '',
      academicYear: academicYear || '2025-2026',
      classCode,
      teacher: req.user._id,
    });

    // Add teacher as class member
    await ClassMember.create({
      classroom: classroom._id,
      user: req.user._id,
      role: 'TEACHER',
    });

    await ActivityLog.create({
      user: req.user._id,
      classroom: classroom._id,
      action: 'CREATED_CLASSROOM',
      details: `Created class '${name}' (${classCode})`,
    });

    res.status(201).json({ success: true, classroom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/classrooms
export const getUserClassrooms = async (req, res) => {
  try {
    const memberships = await ClassMember.find({ user: req.user._id }).populate({
      path: 'classroom',
      populate: { path: 'teacher', select: 'name email profilePhoto' },
    });

    const classrooms = memberships
      .filter((m) => m.classroom && !m.classroom.isArchived)
      .map((m) => ({
        ...m.classroom._doc,
        myRole: m.role,
      }));

    res.json({ success: true, count: classrooms.length, classrooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/classrooms/join
export const joinClassroomByCode = async (req, res) => {
  try {
    const { classCode } = req.body;
    if (!classCode) {
      return res.status(400).json({ success: false, message: 'Classroom code is required.' });
    }

    const classroom = await Classroom.findOne({ classCode: classCode.trim().toUpperCase() });
    if (!classroom) {
      return res.status(404).json({ success: false, message: 'Invalid classroom code. Classroom not found.' });
    }

    if (!classroom.allowJoining) {
      return res.status(403).json({ success: false, message: 'Joining is currently disabled by the teacher.' });
    }

    const existingMember = await ClassMember.findOne({ classroom: classroom._id, user: req.user._id });
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this classroom.' });
    }

    await ClassMember.create({
      classroom: classroom._id,
      user: req.user._id,
      role: req.user.role === 'TEACHER' ? 'TEACHER' : 'STUDENT',
    });

    await ActivityLog.create({
      user: req.user._id,
      classroom: classroom._id,
      action: 'JOINED_CLASSROOM',
      details: `Enrolled in '${classroom.name}'`,
    });

    res.json({ success: true, message: `Successfully enrolled in ${classroom.name}`, classroom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/classrooms/:id
export const getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate('teacher', 'name email profilePhoto department');
    if (!classroom) return res.status(404).json({ success: false, message: 'Classroom not found' });

    const member = await ClassMember.findOne({ classroom: classroom._id, user: req.user._id });
    if (!member && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this classroom.' });
    }

    res.json({ success: true, classroom, myRole: member ? member.role : 'ADMIN' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/classrooms/:id/members
export const getClassroomMembers = async (req, res) => {
  try {
    const members = await ClassMember.find({ classroom: req.params.id }).populate('user', 'name email role studentId profilePhoto department');
    
    const teachers = members.filter((m) => m.role === 'TEACHER').map((m) => m.user);
    const students = members.filter((m) => m.role === 'STUDENT').map((m) => m.user);

    res.json({ success: true, teachers, students, totalMembers: members.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/classrooms/:id/members/:userId
export const removeClassroomMember = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ success: false, message: 'Classroom not found' });

    if (classroom.teacher.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Only class owner or admin can remove members.' });
    }

    await ClassMember.findOneAndDelete({ classroom: req.params.id, user: req.params.userId });
    res.json({ success: true, message: 'Member removed from classroom successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/classrooms/:id/regenerate-code
export const regenerateClassCode = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ success: false, message: 'Classroom not found' });

    if (classroom.teacher.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    classroom.classCode = generateClassCode(classroom.subject);
    await classroom.save();

    res.json({ success: true, classCode: classroom.classCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
