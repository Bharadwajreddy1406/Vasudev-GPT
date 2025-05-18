'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';

// Import our enhanced components
import DivineBackground from '@/components/krishna-ui/DivineBackground';
import ParticleBackground from '@/components/krishna-ui/ParticleBackground';
import ChatSidebar from '@/components/krishna-ui/ChatSidebar';
import ChatMessage from '@/components/krishna-ui/ChatMessage';
import ChatInput from '@/components/krishna-ui/ChatInput';
import Navbar from '@/components/krishna-ui/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';

export default function ChatPage() {
  const {
    chats,
    messages,
    activeChat,
    loading,
    fetchingChats,
    showWelcomeMessage,
    setActiveChat,
    fetchChats,
    fetchMessages,
    sendMessage,
    createNewChat,
    updateChatName
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  // Get chatId from URL params
  const chatIdFromURL = params?.chatId as string;

  // Initial data loading - load chats when component mounts only once
  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set active chat from URL and fetch messages if needed
  useEffect(() => {
    if (chatIdFromURL && chatIdFromURL !== 'new' && chatIdFromURL !== activeChat) {
      setActiveChat(chatIdFromURL);
      fetchMessages(chatIdFromURL);
    } else if (chats.length > 0 && !activeChat) {
      const firstChatId = chats[0].id;
      setActiveChat(firstChatId);
      fetchMessages(firstChatId);
    }
  }, [chatIdFromURL, chats, activeChat]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle creating a new chat
  const handleNewChat = async () => {
    if (!user) return;
    
    const newChatId = await createNewChat();
    if (newChatId) {
      router.push(`/chat/${newChatId}`);
    }
  };
  
  // Handle selecting a chat
  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    router.push(`/chat/${chatId}`);
  };

  // Handle updating a chat name
  const handleUpdateChatName = (chatId: string, newName: string) => {
    updateChatName(chatId, newName);
  };

  // Handle sending a message
  const handleSendMessage = (content: string) => {
    if (activeChat) {
      sendMessage(content);
    }
  };
  
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-900 flex">
      {/* Divine background layers */}      <DivineBackground isChat={true} />
      <ParticleBackground intensity={0.5} />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Chat layout with sidebar and main content */}
      <div className="relative flex w-full h-full z-10 pt-14 sm:pt-16">
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
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
          {/* Chat content area */}
          <div className="flex-1 flex flex-col overflow-hidden pt-4 sm:pt-8">
            {/* Show welcome message when there are no messages */}            {showWelcomeMessage && (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center relative">
                  <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full" />
                  <div className="absolute inset-0 bg-amber-600/5 blur-xl rounded-full animate-pulse" 
                       style={{animationDuration: '4s'}} />
                  
                  <h2 className="font-cinzel text-2xl sm:text-3xl text-amber-400 mb-4 sm:mb-6 relative">
                    Begin Your Divine Conversation
                  </h2>
                  <p className="text-sm sm:text-base text-amber-200/80 max-w-md mx-auto relative">
                    Ask a question below to start your spiritual journey
                  </p>                  
                  <div className="absolute -inset-10 sm:-inset-20 pointer-events-none">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/2 left-1/2 w-24 sm:w-32 h-24 sm:h-32 -ml-12 sm:-ml-16 -mt-12 sm:-mt-16 bg-amber-500/20 rounded-full animate-ping" 
                           style={{animationDuration: '3s'}} />
                      <div className="absolute top-1/2 left-1/2 w-16 sm:w-24 h-16 sm:h-24 -ml-8 sm:-ml-12 -mt-8 sm:-mt-12 bg-amber-400/20 rounded-full animate-ping" 
                           style={{animationDuration: '2.5s'}} />
                      <div className="absolute top-1/2 left-1/2 w-12 sm:w-16 h-12 sm:h-16 -ml-6 sm:-ml-8 -mt-6 sm:-mt-8 bg-amber-300/20 rounded-full animate-ping" 
                           style={{animationDuration: '2s'}} />
                    </div>
                  </div>
                </div>
              </div>
            )}
              {/* Messages container */}
            <div className={`flex-1 overflow-y-auto px-3 sm:px-4 md:px-8 lg:px-16 py-4 space-y-4 ${showWelcomeMessage ? 'hidden' : 'block'}`}>
              <AnimatePresence>
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={message.id}
                    type={message.type}
                    content={message.content}
                    isLatest={message.type === 'ai' && index === messages.length - 1}
                  />
                ))}
                
                {/* Loading indicator */}
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
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat input area */}
            <div className="px-3 sm:px-4 md:px-8 lg:px-16 py-3 sm:py-4 border-t border-amber-500/20 bg-slate-900/40 backdrop-blur-sm">
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