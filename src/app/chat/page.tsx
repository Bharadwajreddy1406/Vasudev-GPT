'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Import our enhanced components
import DivineBackground from '@/components/krishna-ui/DivineBackground';
import ParticleBackground from '@/components/krishna-ui/ParticleBackground';
import KrishnaAnimation from '@/components/krishna-ui/KrishnaAnimation';
import ChatSidebar from '@/components/krishna-ui/ChatSidebar';
import ChatMessage from '@/components/krishna-ui/ChatMessage';
import ChatInput from '@/components/krishna-ui/ChatInput';
import Navbar from '@/components/krishna-ui/Navbar';

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
}

// Example AI responses to simulate Krishna's divine wisdom
const divineResponses = [
  "Remember, you are not this body, you are spirit soul. The body is temporary, but the soul is eternal.",
  "The mind is restless and difficult to control, but it can be conquered through regular practice and detachment.",
  "Whatever happened, happened for the good. Whatever is happening, is happening for the good. Whatever will happen, will also happen for the good.",
  "You have the right to work, but never to the fruit of the work. You should never engage in action for the sake of reward.",
  "Perform your obligatory duty, because action is indeed better than inaction.",
  "Change is the law of the universe. You can be a millionaire or a pauper in an instant.",
  "The soul can never be cut into pieces by any weapon, nor can it be burned by fire, nor moistened by water, nor withered by the wind.",
  "In the unreal there is no being, and in the real there is no non-being.",
  "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place."
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showKrishnaAnimation, setShowKrishnaAnimation] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Initialize with sample chat history
  useEffect(() => {
    // Create some sample chats
    const sampleChats: Chat[] = [
      {
        id: '1',
        title: 'My spiritual journey',
        lastMessage: 'How do I find inner peace?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        id: '2',
        title: 'Bhagavad Gita questions',
        lastMessage: 'Tell me about karma yoga',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
      },
      {
        id: '3', 
        title: 'Daily meditation',
        lastMessage: 'How to improve focus during meditation',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
      }
    ];
    
    setChats(sampleChats);
    setActiveChat('1'); // Set first chat as active
  }, []);

  // Handle user's initial thought from welcome page
  useEffect(() => {
    const userThought = sessionStorage.getItem('userThought');
    
    if (userThought) {
      // Add the user's initial thought
      const initialUserMessage = {
        id: Date.now().toString(),
        content: userThought,
        type: 'user' as const
      };
      
      setMessages([initialUserMessage]);
      setShowKrishnaAnimation(false);
      
      // Clear session storage to avoid repeating the message on refresh
      sessionStorage.removeItem('userThought');
      
      // Simulate AI response with loading
      setLoading(true);
      setTimeout(() => {
        // Random divine response from Krishna
        const initialResponse = {
          id: (Date.now() + 1).toString(),
          content: divineResponses[Math.floor(Math.random() * divineResponses.length)],
          type: 'ai' as const
        };
        
        setMessages(prevMessages => [...prevMessages, initialResponse]);
        setLoading(false);
      }, 2000);
    }
  }, []);
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a new message
  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content,
      type: 'user' as const
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Hide Krishna animation if showing
    if (showKrishnaAnimation) {
      setShowKrishnaAnimation(false);
    }
    
    // Simulate AI response with loading
    setLoading(true);
    setTimeout(() => {
      // Random divine response from Krishna
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: divineResponses[Math.floor(Math.random() * divineResponses.length)],
        type: 'ai' as const
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setLoading(false);
      
      // Update the active chat with the latest message
      if (activeChat) {
        setChats(prevChats => prevChats.map(chat => 
          chat.id === activeChat 
            ? { ...chat, lastMessage: content, timestamp: new Date() } 
            : chat
        ));
      }
    }, 2000);
  };
  
  // Handle creating a new chat
  const handleNewChat = () => {
    // Create a new chat
    const newChat = {
      id: Date.now().toString(),
      title: "New Divine Conversation",
      lastMessage: "Begin your conversation...",
      timestamp: new Date()
    };
    
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
    setMessages([]);
    setShowKrishnaAnimation(true);
  };
  
  // Handle selecting a chat
  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    // In a real app, we would load the messages for this chat from a database
    // For now, we'll just clear the messages
    setMessages([]);
    setShowKrishnaAnimation(true);
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
        />
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-full relative">
          {/* Chat content area with increased padding to account for navbar */}
          <div className="flex-1 flex flex-col overflow-hidden pt-8">
            {/* Show welcome message instead of KrishnaAnimation when there are no messages */}
            {showKrishnaAnimation && messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="font-cinzel text-3xl text-amber-400 mb-6">Begin Your Divine Conversation</h2>
                  <p className="text-amber-200/80 max-w-md mx-auto">
                    Ask a question below to start your spiritual journey
                  </p>
                </div>
              </div>
            )}
            
            {/* Messages container */}
            <div className={`flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-4 space-y-4 ${showKrishnaAnimation && messages.length === 0 ? 'hidden' : 'block'}`}>
              <AnimatePresence>
                {messages.map((message) => (
                  <ChatMessage 
                    key={message.id}
                    type={message.type}
                    content={message.content}
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