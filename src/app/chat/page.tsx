'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import ParticleBackground from '@/components/krishna-ui/ParticleBackground';
import Navbar from '@/components/krishna-ui/Navbar';
import ChatMessage from '@/components/krishna-ui/ChatMessage';
import ChatInput from '@/components/krishna-ui/ChatInput';

// Message type definition
interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if there's an initial thought from the welcome page
    const userThought = sessionStorage.getItem('userThought');
    
    if (userThought) {
      // Add the user's initial thought
      const initialUserMessage = {
        id: Date.now().toString(),
        content: userThought,
        type: 'user' as const
      };
      
      setMessages([initialUserMessage]);
      
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
      }, 1500);
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
    }, 1500);
  };
  
  return (
    <div className="h-screen w-full overflow-hidden maroon-bg flex flex-col">
      {/* Particle background with reduced intensity for chat */}
      <ParticleBackground intensity={0.6} />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main chat content */}
      <motion.main 
        className="flex-1 flex flex-col pt-20 px-4 md:px-8 lg:px-16 max-w-6xl mx-auto w-full relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Chat messages container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
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
                <div className="flex space-x-2 p-4 rounded-2xl bg-maroon border border-amber-600">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input */}
        <div className="py-4 border-t border-amber-900/30">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </motion.main>
    </div>
  );
}