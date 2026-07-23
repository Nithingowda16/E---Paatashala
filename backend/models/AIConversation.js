import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'model'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }
);

const aiConversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Gemini Chat' },
    messages: [chatMessageSchema],
    contextData: { type: String, default: '' },
  },
  { timestamps: true }
);

export const AIConversation = mongoose.model('AIConversation', aiConversationSchema);
