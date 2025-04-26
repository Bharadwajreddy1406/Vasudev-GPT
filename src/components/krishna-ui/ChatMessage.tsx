'use client';

import React, { JSX } from 'react';
import { motion } from 'framer-motion';

type MessageType = 'ai' | 'user';

interface ChatMessageProps {
  type: MessageType;
  content: string;
  className?: string;
  isLatest?: boolean;
}

// Helper function to format AI responses in a poetic style
const formatMeditativeResponse = (content: string): JSX.Element => {
  // Split the content by newlines, periods, question marks, or commas followed by spaces
  const segments = content.split(/(?<=\.\s|\?\s|\,\s|\n)/);
  
  return (
    <>
      {segments.map((segment, index) => {
        // Skip empty segments
        if (!segment.trim()) return null;
        
        return (
          <React.Fragment key={index}>
            <p className="relative font-cinzel text-base font-semibold mb-3" style={{
              background: 'linear-gradient(to bottom, #f6e05e, #b7791f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {segment.trim()}
            </p>
            {/* Add small divider between segments except for the last one */}
            {/* {index < segments.length - 1 && segments.length > 1 && (
              <div className="h-[1px] w-1/2 mx-auto bg-gradient-to-r from-transparent via-blue-400/20 to-transparent my-2" />
            )} */}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default function ChatMessage({ type, content, className, isLatest = false }: ChatMessageProps) {
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
          ? 'bg-blue-900/70 border border-blue-400/30 shadow-lg shadow-blue-900/20' 
          : 'bg-slate-500/10 border border-blue-300/30'
        }
      `}>
        {/* Message content */}
        {type === 'ai' ? (
          <div className="relative">
            {/* Divine emanation effect for AI message */}
            <div className="absolute inset-0 rounded-lg bg-blue-100/5 blur-md -m-2" />
            
            {/* Format AI message in meditative style */}
            {formatMeditativeResponse(content)}
            
            {/* Divine separator */}
            {content.length > 50 && (
              <div className="mt-3 mb-2 flex items-center justify-center opacity-90">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-blue-500/30" />
                <div className="w-1 h-1 mx-2 rounded-full bg-blue-400/50" />
                <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-400/30 via-blue-500/30 to-transparent" />
              </div>
            )}
          </div>
        ) : (
          <p className="font-lora text-base text-blue-50 relative">
            {content}
          </p>
        )}
      </div>
    </motion.div>
  );
}