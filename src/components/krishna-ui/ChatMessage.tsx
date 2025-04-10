'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type MessageType = 'ai' | 'user';

interface ChatMessageProps {
  type: MessageType;
  content: string;
  className?: string;
}

export default function ChatMessage({ type, content, className }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(type === 'ai');
  
  // Typewriter effect for AI responses
  useEffect(() => {
    if (type === 'ai') {
      let index = 0;
      setDisplayedContent('');
      setIsTyping(true);
      
      // Speed up rendering for long messages
      const typingSpeed = Math.max(20, 50 - content.length / 10);
      
      const typingInterval = setInterval(() => {
        if (index < content.length) {
          setDisplayedContent(prev => prev + content.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeed);
      
      return () => clearInterval(typingInterval);
    } else {
      // For user messages, display immediately
      setDisplayedContent(content);
    }
  }, [content, type]);
  
  return (
    <motion.div
      className={`mb-4 max-w-[80%] ${type === 'user' ? 'ml-auto' : 'mr-auto'} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`
        p-4 rounded-xl
        ${type === 'ai' 
          ? 'bg-maroon border border-amber-600 shadow-lg shadow-amber-900/20' 
          : 'bg-cream/10 border border-cream/30'
        }
      `}>
        {/* Message content */}
        {type === 'ai' ? (
          <div className="relative">
            {/* Divine emanation effect for AI message */}
            <div className="absolute inset-0 rounded-lg bg-amber-500/5 blur-md -m-2" />
            
            {/* Main text */}
            <p className="relative font-cinzel text-base divine-text" style={{
              background: 'linear-gradient(to bottom, #f6e05e, #b7791f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {displayedContent}
              {isTyping && (
                <span className="inline-block ml-1 animate-pulse">|</span>
              )}
            </p>
            
            {/* Divine separator */}
            {!isTyping && content.length > 50 && (
              <div className="mt-3 mb-2 flex items-center justify-center opacity-60">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                <div className="w-1 h-1 mx-2 rounded-full bg-amber-400/50" />
                <div className="h-[1px] flex-1 bg-gradient-to-r from-amber-400/30 via-amber-400/30 to-transparent" />
              </div>
            )}
          </div>
        ) : (
          <p className="font-lora text-base text-cream relative">
            {displayedContent}
          </p>
        )}
      </div>
    </motion.div>
  );
}