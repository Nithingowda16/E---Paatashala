import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    markedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'], default: 'PRESENT' },
    method: { type: String, enum: ['MANUAL', 'ONLINE_SESSION', 'MEETING'], default: 'ONLINE_SESSION' },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

attendanceRecordSchema.index({ session: 1, student: 1 }, { unique: true });

export const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceRecordSchema);
