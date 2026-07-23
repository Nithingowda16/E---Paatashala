import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema(
  {
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    eventType: {
      type: String,
      enum: ['ASSIGNMENT', 'LIVE_CLASS', 'ATTENDANCE', 'EXAM', 'ANNOUNCEMENT', 'PERSONAL'],
      default: 'ASSIGNMENT',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

export const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);
