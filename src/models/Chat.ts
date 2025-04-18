import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  icon: { 
    type: String, 
    required: true 
  },
  lastModified: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true });

// Index for sorting by recent activity
ChatSchema.index({ lastModified: -1 });

// Compound index to ensure chat names are unique per user
ChatSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);