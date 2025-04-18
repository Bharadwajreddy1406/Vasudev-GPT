import mongoose from 'mongoose';

const ExchangeSchema = new mongoose.Schema({
  chatId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chat', 
    required: true 
  },
  userMessage: { 
    type: String, 
    required: true 
  },
  aiResponse: { 
    type: String, 
    required: true 
  },
  context: [{
    key: String,
    value: String,
    timestamp: { 
      type: Date, 
      default: Date.now 
    }
  }],
  isFavorite: { 
    type: Boolean, 
    default: false 
  },
  response: { 
    type: String, 
    enum: ['good', 'bad'], 
    default: 'good' 
  }
}, { timestamps: true });

// Index for faster querying of exchanges by chatId
ExchangeSchema.index({ chatId: 1 });

export default mongoose.models.Exchange || mongoose.model('Exchange', ExchangeSchema);