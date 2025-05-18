'use client';

import { useState, useRef, useEffect } from 'react';
import { SendIcon, FeatherIcon } from 'lucide-react';
import { motion, useAnimate } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ChatInputProps {
  onSend: (message: string) => void;
  className?: string;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, className, isLoading = false }: ChatInputProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [buttonRef, animateButton] = useAnimate();
  const [glowRef, animateGlow] = useAnimate();

  // Auto resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // If user is not authenticated, redirect to login
      toast.error('Please login to continue the conversation');
      router.push('/login');
      return;
    }

    if (message.trim() && !isLoading) {      // Animate button with Framer Motion
      animateButton(buttonRef.current, { 
        scale: [1, 1.15, 1] // Reduced scale for smoother effect
      }, { 
        duration: 0.2, // Faster animation
        ease: "easeInOut" 
      });

      // Animate glow effect with Framer Motion
      animateGlow(glowRef.current, { 
        opacity: [0, 0.6, 0], // Reduced opacity for subtler effect
        scale: [1, 1.3] // Reduced scale change
      }, { 
        duration: 0.3, // Faster animation
        ease: "easeInOut" 
      });

      // Send message and clear input
      onSend(message);
      setMessage('');
    }
  };

  // Handle Shift+Enter for new lines vs Enter for submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        handleSubmit(e);
      }
    }
  };  return (
    <motion.div 
      className={`w-full ${className}`}
      initial={{ y: 10, opacity: 0 }} // Reduced distance for smoother entry
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }} // Faster animation
    >
      <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
        {/* Chat input area */}
        <div className="relative flex-grow">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={user ? "Continue your divine conversation..." : "Login to start your divine conversation..."}
            rows={1}
            disabled={isLoading}
            className={`
              w-full px-4 py-3 rounded-md resize-none
              bg-[#092A5E]/90 backdrop-blur-sm
              border-2 border-[#3592BD] hover:border-[#63C6EB] focus:border-[#63C6EB]
              text-[#F5F8FF] font-lora
              focus:outline-none focus:ring-2 focus:ring-[#63C6EB]/50
              transition-colors duration-200
              placeholder:text-[#E8F1FF]/60
              divine-scrollbar
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
              shadow-inner shadow-[#031C3E]
            `}
            maxLength={1000}
            style={{ 
              minHeight: '56px',
              maxHeight: '150px'
            }}
          />
            {/* Character counter */}
          <div className="absolute right-3 bottom-1 text-xs text-[#E8F1FF]/70">
            {message.length > 0 && (
              <span>{message.length}/1000</span>
            )}
          </div>
        </div>
        
        {/* Send button with divine styling */}
        <motion.button
          ref={buttonRef}
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`
            relative min-w-[48px] sm:min-w-[56px] h-[48px] sm:h-[56px] rounded-md
            bg-gradient-to-br from-[#63C6EB] to-[#285CA2] 
            text-[#F5F8FF] 
            hover:from-[#63C6EB] hover:to-[#3592BD] 
            transition-colors duration-200
            flex items-center justify-center
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-[#63C6EB]/70 focus:ring-offset-1
            border-2 border-[#3592BD]
            shadow-md shadow-[#031C3E]/50
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow effect for animation */}
          <motion.div 
            ref={glowRef}
            className="absolute inset-0 rounded-full bg-[#63C6EB] opacity-0"
          />
          
          {isLoading ? (
            <FeatherIcon className="h-5 w-5 text-white animate-pulse" />
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </motion.button>
      </form>
      
      {/* Helpful hint */}
      <div className="mt-2 text-xs text-center text-[#E8F1FF]/40">
        {user ? 'Press Enter to send • Shift+Enter for new line' : 'Please login to interact with Krishna GPT'}
      </div>
    </motion.div>
  );
}