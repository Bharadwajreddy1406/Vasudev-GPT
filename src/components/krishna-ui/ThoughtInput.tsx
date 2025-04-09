'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SendIcon } from 'lucide-react';
import { animate, createScope } from 'animejs';

interface ThoughtInputProps {
  className?: string;
}

export default function ThoughtInput({ className }: ThoughtInputProps) {
  const [thought, setThought] = useState('');
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const scopeRef = useRef<any>(null);
  
  // Create animation scope when component mounts
  useEffect(() => {
    if (!formRef.current) return;
    
    // Initialize the scope with the form element as root
    scopeRef.current = createScope({
      root: formRef.current,
      defaults: {
        duration: 300,
        ease: 'inOutSine'
      }
    }).add(scope => {
      // Register the button animation method in the scope
      scope.add('animateSubmitButton', () => {
        animate('#submit-button', {
          scale: [1, 1.2, 1],
          duration: 300
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
    if (thought.trim()) {
      // Use the registered animation method from scope
      if (scopeRef.current && scopeRef.current.methods) {
        scopeRef.current.methods.animateSubmitButton();
      }
      
      // Add a small delay before navigation for a better UX
      setTimeout(() => {
        // Store the thought in session storage to access in chat page
        sessionStorage.setItem('userThought', thought);
        router.push('/chat');
      }, 400);
    }
  };
  
  return (
    <motion.div 
      className={`w-full  mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 2.5 }}
    >
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="Enter your thoughts today..."
          className="flex-grow  backdrop-blur-2xl  px-4 py-3 rounded-l-full border-2 border-amber-600  bg-opacity-40 text-cream font-lora focus:outline-none focus:ring-2 focus:ring-amber-400"
          autoFocus
        />
        <button
          id="submit-button"
          type="submit"
          className="px-5 py-3 rounded-r-full bg-amber-600 text-maroon hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
          disabled={!thought.trim()}
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
    </motion.div>
  );
}