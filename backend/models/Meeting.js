import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    scheduledStartTime: { type: Date, required: true },
    expectedDurationMinutes: { type: Number, default: 60 },
    meetingCode: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['SCHEDULED', 'LIVE', 'ENDED', 'CANCELLED'],
      default: 'SCHEDULED',
    },
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    minRequiredParticipationPercent: { type: Number, default: 75 },
  },
  { timestamps: true }
);

export const Meeting = mongoose.model('Meeting', meetingSchema);
