import cron from 'node-cron';
import { Assignment } from '../models/Assignment.js';
import { Meeting } from '../models/Meeting.js';
import { Announcement } from '../models/Announcement.js';
import { Material } from '../models/Material.js';
import { ClassMember } from '../models/ClassMember.js';
import { Notification } from '../models/Notification.js';

export const startBackgroundJobs = () => {
  console.log('[Scheduler] Background job engine started.');

  // Run every 10 minutes: Assignment Deadline Reminders
  cron.schedule('*/10 * * * *', async () => {
    try {
      const now = new Date();
      const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const next1h = new Date(now.getTime() + 60 * 60 * 1000);

      // 24 Hour Reminders
      const dueIn24h = await Assignment.find({
        dueDate: { $gte: now, $lte: next24h },
        status: 'PUBLISHED',
      });

      for (const a of dueIn24h) {
        const eventId = `REM_24H_${a._id}`;
        const students = await ClassMember.find({ classroom: a.classroom, role: 'STUDENT' });

        for (const s of students) {
          const exists = await Notification.findOne({ user: s.user, eventId });
          if (!exists) {
            await Notification.create({
              user: s.user,
              title: `Deadline Reminder: ${a.title}`,
              message: `Assignment "${a.title}" is due tomorrow at ${new Date(a.dueDate).toLocaleTimeString()}`,
              type: 'ASSIGNMENT_REMINDER',
              link: `/classroom/${a.classroom}`,
              eventId,
            });
          }
        }
      }

      // 1 Hour Reminders
      const dueIn1h = await Assignment.find({
        dueDate: { $gte: now, $lte: next1h },
        status: 'PUBLISHED',
      });

      for (const a of dueIn1h) {
        const eventId = `REM_1H_${a._id}`;
        const students = await ClassMember.find({ classroom: a.classroom, role: 'STUDENT' });

        for (const s of students) {
          const exists = await Notification.findOne({ user: s.user, eventId });
          if (!exists) {
            await Notification.create({
              user: s.user,
              title: `Urgent Deadline: ${a.title}`,
              message: `Assignment "${a.title}" is due in less than 1 hour!`,
              type: 'ASSIGNMENT_REMINDER',
              link: `/classroom/${a.classroom}`,
              eventId,
            });
          }
        }
      }
    } catch (err) {
      console.error('[Scheduler Error - Assignment Reminders]', err.message);
    }
  });

  // Run every 5 minutes: Publish scheduled posts
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();

      // Scheduled Announcements
      await Announcement.updateMany(
        { isScheduled: true, scheduledFor: { $lte: now }, isPublished: false },
        { isPublished: true, isScheduled: false }
      );

      // Scheduled Materials
      await Material.updateMany(
        { isScheduled: true, scheduledFor: { $lte: now }, isPublished: false },
        { isPublished: true, isScheduled: false }
      );
    } catch (err) {
      console.error('[Scheduler Error - Scheduled Posts]', err.message);
    }
  });
};
