import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    instructions: { type: String, default: '' },
    topic: { type: String, default: 'General' },
    maxMarks: { type: Number, default: 100 },
    dueDate: { type: Date, required: true },
    allowLate: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'CLOSED'],
      default: 'PUBLISHED',
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ],
  },
  { timestamps: true }
);

export const Assignment = mongoose.model('Assignment', assignmentSchema);
