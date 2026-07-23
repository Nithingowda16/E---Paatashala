import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    topic: { type: String, default: 'General' },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        fileSize: Number,
      },
    ],
    isScheduled: { type: Boolean, default: false },
    scheduledFor: { type: Date },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Material = mongoose.model('Material', materialSchema);
