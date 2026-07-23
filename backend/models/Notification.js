import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'ASSIGNMENT_POSTED',
        'ASSIGNMENT_REMINDER',
        'ASSIGNMENT_OVERDUE',
        'ASSIGNMENT_GRADED',
        'MATERIAL_POSTED',
        'ANNOUNCEMENT_POSTED',
        'ATTENDANCE_OPENED',
        'ATTENDANCE_WARNING',
        'MEETING_SCHEDULED',
        'MEETING_STARTING',
        'MEETING_LIVE',
        'MESSAGE_RECEIVED',
      ],
      required: true,
    },
    link: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    eventId: { type: String, default: '' }, // to prevent duplicate notifications
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
