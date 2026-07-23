import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    section: { type: String, default: 'A' },
    room: { type: String, default: 'Lab 101' },
    description: { type: String, default: '' },
    academicYear: { type: String, default: '2025-2026' },
    classCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverBanner: { type: String, default: 'gradient-blue' },
    isArchived: { type: Boolean, default: false },
    allowJoining: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Classroom = mongoose.model('Classroom', classroomSchema);
