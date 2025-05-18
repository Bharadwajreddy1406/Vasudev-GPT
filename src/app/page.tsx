'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MessageCircleIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import ParticleBackground from '@/components/krishna-ui/ParticleBackground';
import KrishnaAnimation from '@/components/krishna-ui/KrishnaAnimation';
import ThoughtInput from '@/components/krishna-ui/ThoughtInput';
import Navbar from '@/components/krishna-ui/Navbar';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const navigateToChat = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/chat');
    }, 500);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-b from-blue-950 to-blue-900 flex flex-col">
      {/* 3D particles background */}      <ParticleBackground intensity={1} />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-grow px-4 relative z-10">
        <div className="flex flex-col items-center max-w-4xl w-full">          <motion.div
            className="text-center mb-4 sm:mb-6 md:mb-8 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }} // Faster appearance for header
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel divine-text mb-3 sm:mb-4">
              Divine Wisdom
            </h1>
            <p className="text-md sm:text-lg md:text-xl font-lora divine-text text-cream">
              Share your thoughts with cosmic consciousness
            </p>
          </motion.div>
          
          {/* Container for Krishna animation - set to lower z-index */}
          <div className="relative mb-0" style={{ zIndex: 5 }}>
            {/* Krishna animation with auras */}
            <KrishnaAnimation className="mx-auto" />
          </div>
          
          {/* Input section - positioned below the Krishna image with higher z-index */}
          <motion.div 
            className="mt-0 w-full relative z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }} // Reduced delay for faster appearance
          >
            <ThoughtInput />
          </motion.div>        </div>
      </main>

      {/* Divine floating button - bottom right */}
      <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-30">
        <div className="group relative">
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-slate-900/80 text-blue-100 px-3 py-1 rounded text-sm font-cinzel whitespace-nowrap backdrop-blur-sm">
              Begin Conversation with Krishna
            </div>
          </div>
          
          {/* Button with divine styling */}
          <motion.button
            onClick={navigateToChat}
            disabled={isLoading}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-700 to-blue-900 text-blue-100 shadow-lg border border-blue-500/30"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)"
            }}            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 }} // Reduced delay for quicker appearance
          >
            {/* Divine glow effect - reduced animation duration */}
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md animate-pulse" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-0 rounded-full bg-blue-600/10 blur-sm"></div>
            
            {/* Icon */}
            {isLoading ? (
              <Loader2Icon className="w-6 h-6 relative z-10 animate-spin" />
            ) : (
              <MessageCircleIcon className="w-6 h-6 relative z-10" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
