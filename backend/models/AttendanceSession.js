import mongoose from 'mongoose';

const attendanceSessionSchema = new mongoose.Schema(
  {
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Class Attendance' },
    date: { type: Date, default: Date.now },
    startTime: { type: Date, default: Date.now },
    windowMinutes: { type: Number, default: 15 },
    lateThresholdMinutes: { type: Number, default: 5 },
    status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
    sessionToken: { type: String, required: true },
  },
  { timestamps: true }
);

export const AttendanceSession = mongoose.model('AttendanceSession', attendanceSessionSchema);
