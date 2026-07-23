import mongoose from 'mongoose';

const classMemberSchema = new mongoose.Schema(
  {
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['TEACHER', 'STUDENT'], required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

classMemberSchema.index({ classroom: 1, user: 1 }, { unique: true });

export const ClassMember = mongoose.model('ClassMember', classMemberSchema);
