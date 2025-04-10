'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MessageCircleIcon } from 'lucide-react';

import ParticleBackground from '@/components/krishna-ui/ParticleBackground';
import KrishnaAnimation from '@/components/krishna-ui/KrishnaAnimation';
import ThoughtInput from '@/components/krishna-ui/ThoughtInput';
import Navbar from '@/components/krishna-ui/Navbar';

export default function Home() {
  const router = useRouter();

  const navigateToChat = () => {
    router.push('/chat');
  };

  return (
    <div className="h-screen w-full overflow-hidden maroon-bg flex flex-col">
      {/* 3D particles background */}
      <ParticleBackground intensity={1} />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-grow px-4 relative z-10">
        <div className="flex flex-col items-center max-w-4xl w-full">
          <motion.div
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel divine-text mb-3 sm:mb-4">
              Divine Wisdom
            </h1>
            <p className="text-md sm:text-lg md:text-xl font-lora text-cream">
              Share your thoughts with cosmic consciousness
            </p>
          </motion.div>
          
          {/* Container for Krishna animation - set to lower z-index */}
          <div className="relative" style={{ zIndex: 5 }}>
            {/* Krishna animation with auras */}
            <KrishnaAnimation className="z-10" />
          </div>
          
          {/* Input section - positioned below the Krishna image with higher z-index */}
          <motion.div 
            className="mt-0 w-full relative z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 2.5 }}
          >
            <ThoughtInput />
          </motion.div>
        </div>
      </main>

      {/* Divine floating button - bottom right */}
      <div className="fixed bottom-8 right-8 z-30">
        <div className="group relative">
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-amber-900/80 text-amber-100 px-3 py-1 rounded text-sm font-cinzel whitespace-nowrap backdrop-blur-sm">
              Begin Divine Conversation
            </div>
          </div>
          
          {/* Button with divine styling */}
          <motion.button
            onClick={navigateToChat}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 shadow-lg border border-amber-500/30"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 0 15px rgba(245, 158, 11, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            {/* Divine glow effect */}
            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md animate-pulse" style={{ animationDuration: '2s' }}></div>
            <div className="absolute inset-0 rounded-full bg-amber-600/10 blur-sm"></div>
            
            {/* Icon */}
            <MessageCircleIcon className="w-6 h-6 relative z-10" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
