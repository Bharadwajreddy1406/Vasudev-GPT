'use client';

import { useState, useRef, useEffect } from 'react';
import { SendIcon } from 'lucide-react';
import { animate, createScope } from 'animejs';

interface ChatInputProps {
  onSend: (message: string) => void;
  className?: string;
}

export default function ChatInput({ onSend, className }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const scopeRef = useRef<any>(null);
  
  // Create animation scope when component mounts
  useEffect(() => {
    if (!formRef.current) return;
    
    scopeRef.current = createScope({
      root: formRef.current,
      defaults: {
        duration: 300,
        ease: 'inOutSine' // Note: changed from "easing" to "ease" per documentation
      }
    }).add(scope => {
      // Register animation function to be called on submit
      scope.add('animateButton', () => {
        animate('#chat-submit-button', {
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
    if (message.trim()) {
      // Animate button using the registered animation method
      if (scopeRef.current && scopeRef.current.methods) {
        scopeRef.current.methods.animateButton();
      }
      
      // Send message and clear input
      onSend(message);
      setMessage('');
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Continue your divine conversation..."
          className="flex-grow px-4 py-3 rounded-l-full border-2 border-amber-600 bg-maroon bg-opacity-40 text-cream font-lora focus:outline-none focus:ring-2 focus:ring-amber-400"
          autoFocus
        />
        <button
          id="chat-submit-button"
          type="submit"
          className="px-5 py-3 rounded-r-full bg-amber-600 text-maroon hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
          disabled={!message.trim()}
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}