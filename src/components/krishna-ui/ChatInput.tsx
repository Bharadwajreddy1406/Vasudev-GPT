'use client';

import { useState, useRef, useEffect } from 'react';
import { SendIcon, FeatherIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { animate, createScope } from 'animejs';

interface ChatInputProps {
  onSend: (message: string) => void;
  className?: string;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, className, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scopeRef = useRef<any>(null);
  
  // Auto resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  // Create animation scope when component mounts
  useEffect(() => {
    if (!formRef.current) return;
    
    scopeRef.current = createScope({
      root: formRef.current,
      defaults: {
        duration: 300,
        ease: 'inOutSine'
      }
    }).add(scope => {
      // Register animation function to be called on submit
      scope.add('animateButton', () => {
        animate('#chat-submit-button', {
          scale: [1, 1.2, 1],
          duration: 300
        });
        
        // Add particles or glow effect
        animate('.send-button-glow', {
          opacity: [0, 0.8, 0],
          scale: [1, 1.5],
          duration: 400,
        });
      });
    });
    
    // Cleanup animations when component unmounts
    return () => {
      if (scopeRef.current) {
        scopeRef.current.revert();
      }
    };
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      // Animate button using the registered animation method
      if (scopeRef.current && scopeRef.current.methods) {
        scopeRef.current.methods.animateButton();
      }
      
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
  };
  
  return (
    <motion.div 
      className={`w-full ${className}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-end">
        {/* Chat input area */}
        <div className="relative flex-grow">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Continue your divine conversation..."
            rows={1}
            disabled={isLoading}
            className={`
              w-full px-4 py-3 rounded-l-full resize-none
              bg-slate-800/50 backdrop-blur-sm
              border-2 border-amber-600/40 hover:border-amber-500/60 focus:border-amber-500
              text-cream font-lora
              focus:outline-none focus:ring-2 focus:ring-amber-400/40
              transition-colors duration-200
              placeholder:text-amber-100/30
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
            maxLength={1000}
            style={{ 
              minHeight: '56px',
              maxHeight: '150px'
            }}
          />
          
          {/* Character counter */}
          <div className="absolute right-3 bottom-1 text-xs text-amber-200/40">
            {message.length > 0 && (
              <span>{message.length}/1000</span>
            )}
          </div>
        </div>
        
        {/* Send button with divine styling */}
        <motion.button
          id="chat-submit-button"
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`
            relative min-w-[56px] h-[56px] rounded-r-full 
            bg-gradient-to-br from-amber-500 to-amber-700 
            text-slate-900 
            hover:from-amber-400 hover:to-amber-600 
            transition-colors duration-200
            flex items-center justify-center
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:ring-offset-1
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow effect for animation */}
          <div className="send-button-glow absolute inset-0 rounded-r-full bg-amber-300 opacity-0" />
          
          {isLoading ? (
            <FeatherIcon className="h-5 w-5 animate-bounce" />
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </motion.button>
      </form>
      
      {/* Helpful hint */}
      <div className="mt-2 text-xs text-center text-amber-200/40">
        Press Enter to send • Shift+Enter for new line
      </div>
    </motion.div>
  );
}