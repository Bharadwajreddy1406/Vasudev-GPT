'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface DivineBackgroundProps {
  className?: string;
  isChat?: boolean;
}

export default function DivineBackground({ className, isChat = false }: DivineBackgroundProps) {
  return (
    <div className={`fixed inset-0 overflow-hidden z-0 ${className}`}>      {/* Static background image for chat */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isChat ? 0.55 : 1.52 }} // Slightly higher opacity for chat
        transition={{ duration: 0.8 }} // Faster transition for the background
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/95 z-10" />
        <Image
          src="/background2.jpeg"
          alt="Divine background"
          fill
          className="object-cover blur-[1px]" // Less blurred for chat
          priority
        />
      </motion.div>

      {/* Only show pulsing rings on non-chat pages */}
      {!isChat && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">          {/* Outer pulsing ring - optimized animation */}
          <motion.div
            className="rounded-full border-2 border-amber-400/30 absolute"
            initial={{ width: "35vh", height: "35vh" }}
            animate={{ 
              width: ["35vh", "39vh", "35vh"], // Reduced range for subtler effect
              height: ["35vh", "39vh", "35vh"],
              opacity: [0.3, 0.25, 0.3] // Less dramatic opacity change
            }}
            transition={{ 
              duration: 6, // Slower for better performance and more meditative feel
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Middle pulsing ring - optimized timing */}
          <motion.div
            className="rounded-full border border-amber-300/20 absolute"
            initial={{ width: "28vh", height: "28vh" }}
            animate={{ 
              width: ["28vh", "31vh", "28vh"], // Reduced range
              height: ["28vh", "31vh", "28vh"],
              opacity: [0.2, 0.15, 0.2] // Less dramatic opacity change
            }}
            transition={{ 
              duration: 5.5, // Slower for better performance
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
          />
          
          {/* Inner pulsing ring - optimized animation */}
          <motion.div
            className="rounded-full border border-amber-200/15 absolute"
            initial={{ width: "20vh", height: "20vh" }}
            animate={{ 
              width: ["20vh", "22vh", "20vh"], // Reduced range
              height: ["20vh", "22vh", "20vh"],
              opacity: [0.15, 0.1, 0.15] // Less dramatic opacity change
            }}
            transition={{ 
              duration: 5, // Slower for better performance
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
          
          {/* Center glow - optimized animation */}
          <motion.div
            className="rounded-full bg-amber-500/5 backdrop-blur-sm absolute"
            initial={{ width: "12vh", height: "12vh" }}
            animate={{ 
              boxShadow: [
                "0 0 15px 0px rgba(245, 158, 11, 0.1)", 
                "0 0 25px 3px rgba(245, 158, 11, 0.15)",
                "0 0 15px 0px rgba(245, 158, 11, 0.1)"
              ],
              opacity: [0.3, 0.4, 0.3] // Less dramatic opacity change
            }}
            transition={{ 
              duration: 6, // Slower and more soothing
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      )}
    </div>
  );
}