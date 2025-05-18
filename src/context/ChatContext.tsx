'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

// Types
export interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
}

export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  icon?: string;
}

export interface Exchange {
  id: string;
  messages: Message[];
  timestamp: Date;
  isFavorite: boolean;
}

interface ChatContextType {
  chats: Chat[];
  messages: Message[];
  activeChat: string | null;
  loading: boolean;
  fetchingChats: boolean;
  showWelcomeMessage: boolean;
  setActiveChat: (chatId: string | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  createNewChat: () => Promise<string | null>;
  updateChatName: (chatId: string, newName: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingChats, setFetchingChats] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  const { user } = useAuth();

  // Load chats from storage on initial load
  useEffect(() => {
    const loadFromStorage = () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Check if we have cached chats
        const storedChats = localStorage.getItem('krishna_chats');
        if (storedChats) {
          const parsedChats = JSON.parse(storedChats);
          // Convert string dates back to Date objects
          const chatsWithDates = parsedChats.map((chat: any) => ({
            ...chat,
            timestamp: new Date(chat.timestamp)
          }));
          setChats(chatsWithDates);
        }
        
        // Check for active chat
        const storedActiveChat = localStorage.getItem('krishna_active_chat');
        if (storedActiveChat) {
          setActiveChat(storedActiveChat);
        }
        
        // Check for messages of active chat
        const storedMessages = localStorage.getItem(`krishna_messages_${storedActiveChat}`);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
          setShowWelcomeMessage(JSON.parse(storedMessages).length === 0);
        }
        
        setInitialized(true);
      } catch (error) {
        console.error('Error loading from storage:', error);
      }
    };
    
    loadFromStorage();
  }, []);
  
  // Save chats to localStorage when they change
  useEffect(() => {
    if (!initialized) return;
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('krishna_chats', JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats to storage:', error);
    }
  }, [chats, initialized]);
  
  // Save active chat to localStorage when it changes
  useEffect(() => {
    if (!initialized) return;
    if (typeof window === 'undefined') return;
    if (activeChat === null) return;
    
    try {
      localStorage.setItem('krishna_active_chat', activeChat);
    } catch (error) {
      console.error('Error saving active chat to storage:', error);
    }
  }, [activeChat, initialized]);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    if (!initialized) return;
    if (typeof window === 'undefined') return;
    if (activeChat === null) return;
    
    try {
      localStorage.setItem(`krishna_messages_${activeChat}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to storage:', error);
    }
  }, [messages, activeChat, initialized]);

  // Fetch chats from API
  const fetchChats = async () => {
    if (!user) return;
    
    try {
      // If we already have chats and aren't explicitly refreshing, use cached data
      if (chats.length > 0 && !fetchingChats) {
        return;
      }
      
      setFetchingChats(true);
      const response = await fetch('/api/chat/recent');
      const data = await response.json();
      
      if (data.success) {
        const formattedChats = data.chats.map((chat: any) => ({
          id: chat._id,
          title: chat.name,
          lastMessage: chat.lastMessage || 'Start a conversation',
          timestamp: new Date(chat.lastModified),
          icon: chat.icon
        }));
        
        setChats(formattedChats);
      } else {
        toast.error('Failed to load chats');
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setFetchingChats(false);
    }
  };
  // Fetch messages for a specific chat
  const fetchMessages = async (chatId: string) => {
    if (!user || !chatId) return;
    
    try {
      // Only set loading true if we're actually sending a new message
      // For initial load of chat history, we don't want to show the "Krishna is contemplating" message
      // setLoading(true); - Remove this line to fix the issue
      
      const response = await fetch(`/api/chat/${chatId}`);
      const data = await response.json();
      
      if (data.success) {
        const allMessages: Message[] = [];
        
        // Sort exchanges by timestamp (oldest first)
        const sortedExchanges = [...data.exchanges].sort((a: Exchange, b: Exchange) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        sortedExchanges.forEach((exchange: Exchange) => {
          exchange.messages.forEach(message => {
            allMessages.push(message);
          });
        });        setMessages(allMessages);
        setShowWelcomeMessage(allMessages.length === 0);
      } else {
        toast.error('Failed to load messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      // Ensure loading is always false after fetching messages
      // This will clear any existing loading state that might be active
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (content: string) => {
    if (!activeChat || !content.trim() || loading) return;
    
    try {
      // Add user message immediately for better UX
      const userMessage: Message = {
        id: `temp_user_${Date.now()}`,
        content,
        type: 'user'
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setShowWelcomeMessage(false);
      setLoading(true);
      
      // Send the message to the server
      const response = await fetch(`/api/chat/${activeChat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add AI response
        const aiMessage: Message = {
          id: `ai_${Date.now()}`,
          content: data.exchange.aiResponse,
          type: 'ai'
        };
        
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        
        // Update the chat in the sidebar with latest message
        setChats(prevChats => prevChats.map(chat => 
          chat.id === activeChat 
            ? { ...chat, lastMessage: content, timestamp: new Date() } 
            : chat
        ));
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // Create a new chat
  const createNewChat = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      // Clear current messages and show welcome message
      setMessages([]);
      setShowWelcomeMessage(true);
      
      // Create a new chat in the database
      const response = await fetch('/api/chat/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: '' }), // Empty message to just create the chat
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add the new chat to the list
        const newChat: Chat = {
          id: data.chatId,
          title: 'New Divine Conversation',
          lastMessage: 'Begin your conversation...',
          timestamp: new Date(),
          icon: data.chat?.icon || 'lotus'
        };
        
        setChats(prevChats => [newChat, ...prevChats]);
        setActiveChat(data.chatId);
        
        return data.chatId;
      } else {
        toast.error(data.message || 'Failed to create new chat');
        return null;
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Failed to create new chat');
      return null;
    }
  };

  // Update chat name
  const updateChatName = (chatId: string, newName: string) => {
    setChats(prevChats => prevChats.map(chat => 
      chat.id === chatId 
        ? { ...chat, title: newName } 
        : chat
    ));
  };

  return (
    <ChatContext.Provider value={{
      chats,
      messages,
      activeChat,
      loading,
      fetchingChats,
      showWelcomeMessage,
      setActiveChat,
      setMessages,
      fetchChats,
      fetchMessages,
      sendMessage,
      createNewChat,
      updateChatName
    }}>
      {children}
    </ChatContext.Provider>
  );
};