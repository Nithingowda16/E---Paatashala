import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
    action: { type: String, required: true },
    details: { type: String, default: '' },
    ipAddress: { type: String, default: '127.0.0.1' },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
