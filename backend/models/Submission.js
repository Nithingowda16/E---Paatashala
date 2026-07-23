import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    textResponse: { type: String, default: '' },
    files: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ],
    status: {
      type: String,
      enum: ['NOT_SUBMITTED', 'SUBMITTED', 'LATE', 'RETURNED', 'GRADED', 'RESUBMITTED'],
      default: 'SUBMITTED',
    },
    submittedAt: { type: Date, default: Date.now },
    marksObtained: { type: Number, default: null },
    feedback: { type: String, default: '' },
    gradedAt: { type: Date },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export const Submission = mongoose.model('Submission', submissionSchema);
