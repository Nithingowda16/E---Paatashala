import { CalendarEvent } from '../models/CalendarEvent.js';
import { Assignment } from '../models/Assignment.js';
import { Meeting } from '../models/Meeting.js';
import { ClassMember } from '../models/ClassMember.js';

// @route GET /api/calendar
export const getCalendarEvents = async (req, res) => {
  try {
    const memberships = await ClassMember.find({ user: req.user._id });
    const classIds = memberships.map((m) => m.classroom);

    // Fetch assignments
    const assignments = await Assignment.find({ classroom: { $in: classIds } }).populate('classroom', 'name');
    // Fetch live meetings
    const meetings = await Meeting.find({ classroom: { $in: classIds } }).populate('classroom', 'name');
    // Fetch custom calendar events
    const customEvents = await CalendarEvent.find({
      $or: [{ classroom: { $in: classIds } }, { user: req.user._id }],
    }).populate('classroom', 'name');

    const formattedAssignments = assignments.map((a) => ({
      id: `assign_${a._id}`,
      title: `Assignment: ${a.title}`,
      description: `Class: ${a.classroom?.name}`,
      startDate: a.dueDate,
      eventType: 'ASSIGNMENT',
      link: `/classroom/${a.classroom?._id}`,
    }));

    const formattedMeetings = meetings.map((m) => ({
      id: `meet_${m._id}`,
      title: `Live Class: ${m.title}`,
      description: `Class: ${m.classroom?.name}`,
      startDate: m.scheduledStartTime,
      eventType: 'LIVE_CLASS',
      link: `/classroom/${m.classroom?._id}`,
    }));

    const formattedCustom = customEvents.map((c) => ({
      id: `custom_${c._id}`,
      title: c.title,
      description: c.description,
      startDate: c.startDate,
      eventType: c.eventType,
      link: c.link,
    }));

    const events = [...formattedAssignments, ...formattedMeetings, ...formattedCustom].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    res.json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
