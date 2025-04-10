'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SendIcon, Loader2Icon } from 'lucide-react';

interface ThoughtInputProps {
  className?: string;
}

export default function ThoughtInput({ className }: ThoughtInputProps) {
  const [thought, setThought] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim() && !isLoading) {
      // Show loading state
      setIsLoading(true);
      
      // Store the thought in session storage to access in chat page
      sessionStorage.setItem('userThought', thought);
      
      // Navigate to chat after a brief delay
      setTimeout(() => {
        router.push('/chat');
      }, 800);
    }
  };
  
  return (
    <motion.div 
      className={`w-full mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 2.5 }}
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="Enter your thoughts today..."
          className="flex-grow backdrop-blur-2xl px-4 py-3 rounded-full border-2 border-blue-300 bg-opacity-40 text-slate-100 font-lora focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoFocus
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-7 py-4 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={!thought.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2Icon className="h-5 w-5 animate-spin" />
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </button>
      </form>
    </motion.div>
  );
}