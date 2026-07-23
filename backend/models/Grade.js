import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema(
  {
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

gradeSchema.index({ assignment: 1, student: 1 }, { unique: true });

export const Grade = mongoose.model('Grade', gradeSchema);
