import mongoose from 'mongoose';

const meetingParticipantSchema = new mongoose.Schema(
  {
    meeting: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    joinTime: { type: Date, default: Date.now },
    leaveTime: { type: Date },
    totalDurationMinutes: { type: Number, default: 0 },
    participationPercentage: { type: Number, default: 0 },
    attendanceStatus: {
      type: String,
      enum: ['PRESENT', 'PARTIAL', 'ABSENT'],
      default: 'ABSENT',
    },
  },
  { timestamps: true }
);

meetingParticipantSchema.index({ meeting: 1, student: 1 });

export const MeetingParticipant = mongoose.model('MeetingParticipant', meetingParticipantSchema);
