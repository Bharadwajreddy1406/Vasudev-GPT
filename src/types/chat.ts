import { Types } from 'mongoose';

/**
 * User model interface
 */
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
  password: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat model interface
 */
export interface IChat {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  icon: string;
  lastModified: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Context item in an exchange
 */
export interface IContextItem {
  key: string;
  value: string;
  timestamp: Date;
}

/**
 * Response type enum
 */
export type ResponseType = 'good' | 'bad';

/**
 * Exchange model interface
 */
export interface IExchange {
  _id: Types.ObjectId;
  chatId: Types.ObjectId;
  userMessage: string;
  aiResponse: string;
  context: IContextItem[];
  isFavorite: boolean;
  response: ResponseType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat with optional exchanges for frontend display
 */
export interface ChatWithExchanges {
  chat: IChat;
  exchanges: IExchange[];
}

/**
 * API response for creating/updating chats and exchanges
 */
export interface ChatResponse {
  chatId: string;
  exchange?: IExchange;
  chat?: IChat;
  isNewChat?: boolean;
}