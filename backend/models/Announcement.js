import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }
);

const announcementSchema = new mongoose.Schema(
  {
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ],
    comments: [commentSchema],
    isScheduled: { type: Boolean, default: false },
    scheduledFor: { type: Date },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
