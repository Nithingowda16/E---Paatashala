import { Meeting } from '../models/Meeting.js';
import { MeetingParticipant } from '../models/MeetingParticipant.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { AttendanceSession } from '../models/AttendanceSession.js';
import { Classroom } from '../models/Classroom.js';
import { Notification } from '../models/Notification.js';
import { ClassMember } from '../models/ClassMember.js';
import crypto from 'crypto';

// @route POST /api/meetings (Schedule Meeting)
export const scheduleMeeting = async (req, res) => {
  try {
    const { classroomId, title, description, scheduledStartTime, expectedDurationMinutes } = req.body;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) return res.status(404).json({ success: false, message: 'Classroom not found' });

    const meetingCode = `MEET-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const meeting = await Meeting.create({
      classroom: classroomId,
      host: req.user._id,
      title,
      description: description || '',
      scheduledStartTime: new Date(scheduledStartTime),
      expectedDurationMinutes: Number(expectedDurationMinutes) || 60,
      meetingCode,
      status: 'SCHEDULED',
    });

    // Send notifications to class students
    const members = await ClassMember.find({ classroom: classroomId, role: 'STUDENT' });
    const notifications = members.map((m) => ({
      user: m.user,
      title: `New Online Class Scheduled: ${title}`,
      message: `${classroom.name} live class scheduled for ${new Date(scheduledStartTime).toLocaleString()}`,
      type: 'MEETING_SCHEDULED',
      link: `/classroom/${classroomId}`,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/meetings/classroom/:classroomId
export const getClassroomMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ classroom: req.params.classroomId })
      .sort({ scheduledStartTime: 1 })
      .populate('host', 'name profilePhoto email');

    res.json({ success: true, meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/meetings/:id/start (Host Teacher)
export const startMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

    if (meeting.host.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Only meeting host can start the meeting.' });
    }

    meeting.status = 'LIVE';
    meeting.actualStartTime = new Date();
    await meeting.save();

    // Alert students meeting is LIVE NOW
    const members = await ClassMember.find({ classroom: meeting.classroom, role: 'STUDENT' });
    const classroom = await Classroom.findById(meeting.classroom);

    const notifications = members.map((m) => ({
      user: m.user,
      title: `LIVE NOW: ${meeting.title}`,
      message: `Live class for ${classroom.name} has started. Join meeting now!`,
      type: 'MEETING_LIVE',
      link: `/classroom/${meeting.classroom}`,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.json({ success: true, message: 'Meeting is now live.', meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/meetings/:id/end (Host Teacher - Calculates Meeting Participation Attendance)
export const endMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

    const now = new Date();
    meeting.status = 'ENDED';
    meeting.actualEndTime = now;
    await meeting.save();

    const meetingDurationMs = meeting.actualStartTime ? now - new Date(meeting.actualStartTime) : meeting.expectedDurationMinutes * 60000;
    const meetingDurationMinutes = Math.max(1, Math.round(meetingDurationMs / (1000 * 60)));

    // Create an automatic Attendance Session linked to meeting
    const attendanceSession = await AttendanceSession.create({
      classroom: meeting.classroom,
      createdBy: req.user._id,
      title: `Meeting Attendance - ${meeting.title}`,
      date: now,
      startTime: meeting.actualStartTime || now,
      windowMinutes: meetingDurationMinutes,
      status: 'CLOSED',
      sessionToken: `MEET_ATT_${meeting._id}`,
    });

    // Compute backend participation for all meeting participants
    const participants = await MeetingParticipant.find({ meeting: meeting._id });

    for (const p of participants) {
      const durationMin = p.totalDurationMinutes || 5; // minimum join credit
      const percentage = Math.min(100, Math.round((durationMin / meetingDurationMinutes) * 100));
      
      const attendanceStatus = percentage >= meeting.minRequiredParticipationPercent ? 'PRESENT' : percentage >= 40 ? 'LATE' : 'ABSENT';

      p.participationPercentage = percentage;
      p.attendanceStatus = attendanceStatus;
      await p.save();

      // Write authoritative AttendanceRecord
      await AttendanceRecord.findOneAndUpdate(
        { session: attendanceSession._id, student: p.student },
        {
          session: attendanceSession._id,
          classroom: meeting.classroom,
          student: p.student,
          markedAt: now,
          status: attendanceStatus,
          method: 'MEETING',
          remarks: `Joined online class for ${durationMin}/${meetingDurationMinutes} mins (${percentage}%)`,
        },
        { upsert: true }
      );
    }

    res.json({ success: true, message: 'Meeting ended and meeting participation attendance calculated.', meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/meetings/:id/join-log (Backend calculation endpoint)
export const logMeetingJoin = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { durationMinutes } = req.body;

    let participant = await MeetingParticipant.findOne({ meeting: meetingId, student: req.user._id });
    const now = new Date();

    if (!participant) {
      participant = await MeetingParticipant.create({
        meeting: meetingId,
        student: req.user._id,
        joinTime: now,
        totalDurationMinutes: Number(durationMinutes) || 10,
      });
    } else {
      participant.leaveTime = now;
      participant.totalDurationMinutes += Number(durationMinutes) || 5;
      await participant.save();
    }

    res.json({ success: true, participant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
