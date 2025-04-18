import { Types } from 'mongoose';
import Chat from '@/models/Chat';
import Exchange from '@/models/Exchange';
import connectToDatabase from './mongodb';
import { IContextItem } from '@/types/chat';

// Chat icons available in the system
const CHAT_ICONS = [
  'lotus', 'star', 'book', 'feather', 'sun', 
  'moon', 'sparkles', 'heart', 'flame', 'tree'
];

/**
 * Get a random icon for a new chat
 */
export const getRandomIcon = (): string => {
  return CHAT_ICONS[Math.floor(Math.random() * CHAT_ICONS.length)];
};

/**
 * Interface for creating a new chat
 */
interface CreateChatParams {
  userId: string;
  name: string;
  icon?: string;
}

/**
 * Create a new chat for a user
 */
export const createChat = async ({ userId, name, icon }: CreateChatParams) => {
  await connectToDatabase();
  
  const chat = new Chat({
    userId: new Types.ObjectId(userId),
    name,
    icon: icon || getRandomIcon(),
    lastModified: new Date()
  });
  
  await chat.save();
  return chat;
};

/**
 * Interface for creating a new exchange
 */
interface CreateExchangeParams {
  chatId: string;
  userMessage: string;
  aiResponse: string;
  context?: Array<{ key: string; value: string }>;
}

/**
 * Create a new exchange in a chat
 */
export const createExchange = async ({ 
  chatId, userMessage, aiResponse, context = [] 
}: CreateExchangeParams) => {
  await connectToDatabase();
  
  // Create the exchange
  const exchange = new Exchange({
    chatId: new Types.ObjectId(chatId),
    userMessage,
    aiResponse,
    context: context.map(item => ({
      ...item,
      timestamp: new Date()
    }))
  });
  
  await exchange.save();
  
  // Update the lastModified date on the chat
  await Chat.findByIdAndUpdate(
    chatId, 
    { 
      lastModified: new Date() 
    }
  );
  
  return exchange;
};

/**
 * Generate a chat name from the first message using AI
 * @param message The user's initial message
 */
export const generateChatName = async (message: string): Promise<string> => {
  // This would be replaced with an actual API call to an AI service
  // For now, generate a simple name based on the first few words
  
  // Extract first 2-4 words for the chat name
  const words = message.split(' ');
  const nameWords = words.slice(0, Math.min(4, words.length));
  let name = nameWords.join(' ');
  
  // Add ellipsis if truncated and capitalize first letter
  if (words.length > 4) name += '...';
  name = name.charAt(0).toUpperCase() + name.slice(1);
  
  // Limit to max 30 characters
  return name.length > 30 ? name.substring(0, 27) + '...' : name;
};

/**
 * Handle a new message from a user
 * If chatId is provided, add to existing chat
 * If no chatId, create a new chat with a generated name
 */
export const handleUserMessage = async ({
  userId,
  chatId,
  message,
  aiResponse,
  contextData = []
}: {
  userId: string;
  chatId?: string;
  message: string;
  aiResponse: string;
  contextData?: Array<{ key: string; value: string }>;
}) => {
  await connectToDatabase();
  
  // If chatId is provided, add to existing chat
  if (chatId) {
    const exchange = await createExchange({
      chatId,
      userMessage: message,
      aiResponse,
      context: contextData
    });
    
    return { chatId, exchange };
  }
  
  // If no chatId, create a new chat with a generated name
  const chatName = await generateChatName(message);
  
  const chat = await createChat({
    userId,
    name: chatName
  });
  
  // Create the first exchange in the new chat
  const exchange = await createExchange({
    chatId: chat._id.toString(),
    userMessage: message,
    aiResponse,
    context: contextData
  });
  
  return { 
    chatId: chat._id.toString(), 
    chat, 
    exchange,
    isNewChat: true
  };
};

/**
 * Get recent chats for a user
 */
export const getUserChats = async (userId: string) => {
  await connectToDatabase();
  
  return Chat.find({ userId: new Types.ObjectId(userId) })
    .sort({ lastModified: -1 })
    .lean();
};

/**
 * Get recent exchanges for a specific chat
 */
export const getChatExchanges = async (chatId: string, limit = 10) => {
  await connectToDatabase();
  
  return Exchange.find({ chatId: new Types.ObjectId(chatId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

/**
 * Get user's recent activity across all chats
 */
export const getUserRecentActivity = async (userId: string) => {
  await connectToDatabase();
  
  // Get all chats for the user, sorted by last modified
  const chats = await getUserChats(userId);
  
  // For each chat, get the most recent exchanges
  const chatActivity = await Promise.all(
    chats.map(async (chat) => {
      const exchanges = await getChatExchanges((chat._id as Types.ObjectId).toString(), 5);
      return {
        chat,
        exchanges: exchanges.reverse() // Show in chronological order
      };
    })
  );
  
  return chatActivity;
};

/**
 * Update the context for an exchange
 */
export const updateExchangeContext = async (
  exchangeId: string,
  contextItem: { key: string; value: string }
) => {
  await connectToDatabase();
  
  const exchange = await Exchange.findById(exchangeId);
  
  if (!exchange) {
    throw new Error('Exchange not found');
  }
  
  // Add new context item with timestamp
  const newContextItem: IContextItem = {
    ...contextItem,
    timestamp: new Date()
  };
  
  exchange.context.push(newContextItem);
  await exchange.save();
  
  return exchange;
};

/**
 * Get all exchanges with a specific context key
 * Useful for retrieving all exchanges that contain a particular piece of information
 */
export const getExchangesByContextKey = async (userId: string, key: string) => {
  await connectToDatabase();
  
  // First get all chats for this user
  const chats = await Chat.find({ userId: new Types.ObjectId(userId) });
  const chatIds = chats.map(chat => chat._id);
  
  // Find exchanges in any of these chats that have the specific context key
  return Exchange.find({
    chatId: { $in: chatIds },
    'context.key': key
  }).sort({ createdAt: -1 }).lean();
};

/**
 * Toggle favorite status for an exchange
 */
export const toggleExchangeFavorite = async (exchangeId: string, isFavorite?: boolean) => {
  await connectToDatabase();
  
  const exchange = await Exchange.findById(exchangeId);
  
  if (!exchange) {
    throw new Error('Exchange not found');
  }
  
  // Toggle or set specific value
  exchange.isFavorite = isFavorite !== undefined ? isFavorite : !exchange.isFavorite;
  await exchange.save();
  
  return exchange;
};

/**
 * Set response rating for an exchange
 */
export const setExchangeRating = async (exchangeId: string, rating: 'good' | 'bad') => {
  await connectToDatabase();
  
  const exchange = await Exchange.findById(exchangeId);
  
  if (!exchange) {
    throw new Error('Exchange not found');
  }
  
  exchange.response = rating;
  await exchange.save();
  
  return exchange;
};