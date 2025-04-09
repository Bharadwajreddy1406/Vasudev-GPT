'use client';

import React from 'react';
import { motion } from 'framer-motion';

type MessageType = 'ai' | 'user';

interface ChatMessageProps {
  type: MessageType;
  content: string;
  className?: string;
}

export default function ChatMessage({ type, content, className }: ChatMessageProps) {
  return (
    <motion.div
      className={`mb-4 max-w-[80%] ${type === 'user' ? 'ml-auto' : 'mr-auto'} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`p-4 rounded-2xl ${
        type === 'ai' 
          ? 'bg-maroon border border-amber-600 text-gold' 
          : 'bg-cream/10 border border-cream/30 text-cream'
      }`}>
        <p className={`text-base ${type === 'ai' ? 'font-lora divine-text' : 'font-lora'}`}>
          {content}
        </p>
      </div>
    </motion.div>
  );
}