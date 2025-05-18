'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SendIcon, Loader2Icon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ThoughtInputProps {
  className?: string;
}

export default function ThoughtInput({ className }: ThoughtInputProps) {
  const [thought, setThought] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim() && !isLoading) {
      // Show loading state
      setIsLoading(true);
      setError(null);
      
      try {
        // Send the thought to API to create a new chat
        const response = await fetch('/api/chat/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: thought }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }
        
        // Navigate to the newly created chat
        router.push(`/chat/${data.chatId}`);
      } catch (err) {
        console.error('Error creating chat:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    }
  };    return (
    <motion.div 
      className={`w-full max-w-lg mx-auto px-3 sm:px-0 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }} // Matches the timing in page.tsx
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder={user ? "Enter your thoughts today..." : "Login to share your thoughts..."}
          className="flex-grow backdrop-blur-2xl px-3 sm:px-4 py-3 rounded-xl border-2 border-blue-300 bg-opacity-40 text-slate-100 font-lora focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          autoFocus          disabled={isLoading || !user}
        />
        <button
          type="submit"
          className="px-5 sm:px-7 py-3 sm:py-4 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 flex-shrink-0"
          disabled={!thought.trim() || isLoading || !user}
        >
          {isLoading ? (
            <Loader2Icon className="h-5 w-5 animate-spin" />
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </button>
      </form>
      {error && (
        <div className="mt-2 text-red-400 text-sm">{error}</div>
      )}
      {!user && (
        <div className="mt-2 text-blue-300/70 text-sm text-center">Please login to start a conversation</div>
      )}
    </motion.div>
  );
}