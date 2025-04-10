'use client';

import { motion } from 'framer-motion';

import ParticleBackground from '@/components/krishna-ui/ParticleBackground';
import KrishnaAnimation from '@/components/krishna-ui/KrishnaAnimation';
import ThoughtInput from '@/components/krishna-ui/ThoughtInput';
import Navbar from '@/components/krishna-ui/Navbar';

export default function Home() {
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
    </div>
  );
}
