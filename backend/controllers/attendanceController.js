import { AttendanceSession } from '../models/AttendanceSession.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { ClassMember } from '../models/ClassMember.js';
import { Classroom } from '../models/Classroom.js';
import { Notification } from '../models/Notification.js';
import crypto from 'crypto';

// @route POST /api/attendance/sessions (Teacher)
export const startAttendanceSession = async (req, res) => {
  try {
    const { classroomId, title, windowMinutes, lateThresholdMinutes } = req.body;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) return res.status(404).json({ success: false, message: 'Classroom not found' });

    const sessionToken = crypto.randomBytes(16).toString('hex');
    const now = new Date();

    const session = await AttendanceSession.create({
      classroom: classroomId,
      createdBy: req.user._id,
      title: title || `Attendance - ${now.toLocaleDateString()}`,
      date: now,
      startTime: now,
      windowMinutes: Number(windowMinutes) || 15,
      lateThresholdMinutes: Number(lateThresholdMinutes) || 5,
      sessionToken,
      status: 'OPEN',
    });

    // Send notification alert to all students in classroom
    const members = await ClassMember.find({ classroom: classroomId, role: 'STUDENT' });
    const notifications = members.map((m) => ({
      user: m.user,
      title: `Attendance Open: ${classroom.name}`,
      message: `Attendance window is active for ${session.windowMinutes} minutes. Mark present now!`,
      type: 'ATTENDANCE_OPENED',
      link: `/classroom/${classroomId}`,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, message: 'Attendance session started successfully.', session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/attendance/mark (Student)
export const markAttendance = async (req, res) => {
  try {
    const { sessionId, sessionToken } = req.body;
    const serverNow = new Date(); // AUTHORITATIVE SERVER TIMESTAMP

    const session = await AttendanceSession.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Attendance session not found' });

    if (session.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'Attendance session is closed.' });
    }

    if (session.sessionToken !== sessionToken) {
      return res.status(400).json({ success: false, message: 'Invalid or expired attendance session token.' });
    }

    // Verify window bounds using server time
    const elapsedMinutes = (serverNow - new Date(session.startTime)) / (1000 * 60);
    if (elapsedMinutes > session.windowMinutes) {
      session.status = 'CLOSED';
      await session.save();
      return res.status(400).json({ success: false, message: 'Attendance window has expired.' });
    }

    // Verify user membership
    const isMember = await ClassMember.findOne({ classroom: session.classroom, user: req.user._id, role: 'STUDENT' });
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this classroom.' });
    }

    // Prevent duplicates
    const existing = await AttendanceRecord.findOne({ session: session._id, student: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already marked attendance for this session.' });
    }

    const isLate = elapsedMinutes > session.lateThresholdMinutes;
    const record = await AttendanceRecord.create({
      session: session._id,
      classroom: session.classroom,
      student: req.user._id,
      markedAt: serverNow,
      status: isLate ? 'LATE' : 'PRESENT',
      method: 'ONLINE_SESSION',
    });

    res.json({ success: true, message: `Attendance marked as ${record.status}`, record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/attendance/classroom/:classroomId
export const getClassroomAttendanceStats = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const sessions = await AttendanceSession.find({ classroom: classroomId }).sort({ createdAt: -1 });
    const members = await ClassMember.find({ classroom: classroomId, role: 'STUDENT' }).populate('user', 'name email profilePhoto studentId');
    const records = await AttendanceRecord.find({ classroom: classroomId });

    if (req.user.role === 'STUDENT') {
      const studentRecords = records.filter((r) => r.student.toString() === req.user._id.toString());
      const presentCount = studentRecords.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
      const totalSessions = sessions.length;
      const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;

      return res.json({
        success: true,
        stats: {
          totalSessions,
          attendedSessions: presentCount,
          percentage,
          records: studentRecords,
          activeSession: sessions.find((s) => s.status === 'OPEN') || null,
        },
      });
    }

    // Teacher View
    const totalSessions = sessions.length;
    const studentStats = members.map((m) => {
      const memberUserId = (m.user._id || m.user).toString();
      const sRecords = records.filter((r) => {
        const recordStudentId = (r.student._id || r.student).toString();
        return recordStudentId === memberUserId;
      });
      const presentCount = sRecords.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
      const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;

      return {
        student: m.user,
        attendedCount: presentCount,
        totalSessions,
        percentage,
        isLowAttendance: percentage < 75,
      };
    });

    const activeSession = sessions.find((s) => s.status === 'OPEN') || null;

    res.json({
      success: true,
      activeSession,
      sessions,
      totalSessions,
      studentStats,
      lowAttendanceCount: studentStats.filter((s) => s.isLowAttendance).length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
