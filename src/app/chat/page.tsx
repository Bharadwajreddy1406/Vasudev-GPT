'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Import our enhanced components
import DivineBackground from '@/components/krishna-ui/DivineBackground';
import ParticleBackground from '@/components/krishna-ui/ParticleBackground';
import ChatSidebar from '@/components/krishna-ui/ChatSidebar';
import ChatMessage from '@/components/krishna-ui/ChatMessage';
import ChatInput from '@/components/krishna-ui/ChatInput';
import Navbar from '@/components/krishna-ui/Navbar';
import { useAuth } from '@/context/AuthContext';

// Message type definition
interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
}

// Chat history interface
interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  icon?: string;
}

// Exchange interface
interface Exchange {
  id: string;
  messages: Message[];
  timestamp: Date;
  isFavorite: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingChats, setFetchingChats] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  // Get chatId from URL params
  const chatIdFromURL = params?.chatId as string;

  // Fetch user's chats
  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;
      
      try {
        setFetchingChats(true);
        const response = await fetch('/api/chat/recent');
        const data = await response.json();
        
        if (data.success) {
          setChats(data.chats.map((chat: any) => ({
            id: chat._id,
            title: chat.name,
            lastMessage: chat.lastMessage || 'Start a conversation',
            timestamp: new Date(chat.lastModified),
            icon: chat.icon
          })));
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
    
    loadChats();
  }, [user]);

  // Load messages when a chat is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !activeChat) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/chat/${activeChat}`);
        const data = await response.json();
        
        if (data.success) {
          // Flatten exchanges into messages array
          const allMessages: Message[] = [];
          
          // Sort exchanges by timestamp to ensure chronological order (oldest first)
          const sortedExchanges = [...data.exchanges].sort((a: Exchange, b: Exchange) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          
          sortedExchanges.forEach((exchange: Exchange) => {
            exchange.messages.forEach(message => {
              allMessages.push(message);
            });
          });
          
          setMessages(allMessages);
          setShowWelcomeMessage(allMessages.length === 0);
        } else {
          toast.error('Failed to load messages');
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    if (activeChat) {
      loadMessages();
    }
  }, [activeChat, user]);

  // Set active chat from URL or first chat in list
  useEffect(() => {
    if (chatIdFromURL && chatIdFromURL !== 'new') {
      setActiveChat(chatIdFromURL);
    } else if (chats.length > 0 && !activeChat) {
      setActiveChat(chats[0].id);
    }
  }, [chatIdFromURL, chats, activeChat]);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
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
  
  // Handle creating a new chat
  const handleNewChat = async () => {
    if (!user) return;
    
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
        
        // Update URL without full refresh
        router.push(`/chat/${data.chatId}`);
      } else {
        toast.error(data.message || 'Failed to create new chat');
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Failed to create new chat');
    }
  };
  
  // Handle selecting a chat
  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    router.push(`/chat/${chatId}`);
  };

  // Handle updating a chat name
  const handleUpdateChatName = (chatId: string, newName: string) => {
    setChats(prevChats => prevChats.map(chat => 
      chat.id === chatId 
        ? { ...chat, title: newName } 
        : chat
    ));
  };
  
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-900 flex">
      {/* Divine background layers */}
      <DivineBackground isChat={true} />
      <ParticleBackground intensity={0.5} />
      
      {/* Navbar positioned outside the flex layout for proper fixed positioning */}
      <Navbar />
      
      {/* Chat layout with sidebar and main content */}
      <div className="relative flex w-full h-full z-10 pt-16">
        {/* Chat sidebar */}
        <ChatSidebar 
          chats={chats}
          activeChat={activeChat} 
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
          onUpdateChatName={handleUpdateChatName}
          isLoading={fetchingChats}
        />
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-full relative">
          {/* Chat content area with increased padding to account for navbar */}
          <div className="flex-1 flex flex-col overflow-hidden pt-8">
            {/* Show welcome message when there are no messages */}
            {showWelcomeMessage && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center relative">
                  {/* Divine glow effect behind text */}
                  <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full" />
                  <div className="absolute inset-0 bg-amber-600/5 blur-xl rounded-full animate-pulse" 
                       style={{animationDuration: '4s'}} />
                  
                  <h2 className="font-cinzel text-3xl text-amber-400 mb-6 relative">
                    Begin Your Divine Conversation
                  </h2>
                  <p className="text-amber-200/80 max-w-md mx-auto relative">
                    Ask a question below to start your spiritual journey
                  </p>
                  
                  {/* Animated aura pulses */}
                  <div className="absolute -inset-20 pointer-events-none">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/2 left-1/2 w-32 h-32 -ml-16 -mt-16 bg-amber-500/20 rounded-full animate-ping" 
                           style={{animationDuration: '3s'}} />
                      <div className="absolute top-1/2 left-1/2 w-24 h-24 -ml-12 -mt-12 bg-amber-400/20 rounded-full animate-ping" 
                           style={{animationDuration: '2.5s'}} />
                      <div className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 bg-amber-300/20 rounded-full animate-ping" 
                           style={{animationDuration: '2s'}} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Messages container */}
            <div className={`flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-4 space-y-4 ${showWelcomeMessage ? 'hidden' : 'block'}`}>
              <AnimatePresence>
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={message.id}
                    type={message.type}
                    content={message.content}
                    isLatest={message.type === 'ai' && index === messages.length - 1}
                  />
                ))}
                
                {/* Loading indicator when AI is "typing" */}
                {loading && (
                  <motion.div
                    className="mb-4 max-w-[80%] mr-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col space-y-2 p-4 rounded-xl bg-maroon/30 border border-amber-600/50 backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                      <span className="text-xs text-amber-300/70 font-cinzel">Krishna is contemplating...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat input area */}
            <div className="px-4 md:px-8 lg:px-16 py-4 border-t border-amber-500/20 bg-slate-900/40 backdrop-blur-sm">
              <ChatInput 
                onSend={handleSendMessage} 
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}