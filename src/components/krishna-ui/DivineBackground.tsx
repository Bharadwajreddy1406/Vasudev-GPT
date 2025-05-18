'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';

interface DivineBackgroundProps {
  className?: string;
  isChat?: boolean;
}

export default function DivineBackground({ className, isChat = false }: DivineBackgroundProps) {
  const isMobile = useIsMobile();
  
  // Optimize animations for mobile
  const ringAnimations = useMemo(() => {
    // Simplified animations for mobile to improve performance
    if (isMobile) {
      return {
        outer: {
          widthAnim: ["30vh", "32vh", "30vh"],
          heightAnim: ["30vh", "32vh", "30vh"],
          opacityAnim: [0.25, 0.2, 0.25],
          duration: 7 // Slower on mobile for better performance
        },
        middle: {
          widthAnim: ["24vh", "26vh", "24vh"],
          heightAnim: ["24vh", "26vh", "24vh"],
          opacityAnim: [0.18, 0.12, 0.18],
          duration: 6.5
        },
        inner: {
          widthAnim: ["16vh", "18vh", "16vh"],
          heightAnim: ["16vh", "18vh", "16vh"],
          opacityAnim: [0.12, 0.08, 0.12],
          duration: 6
        },
        center: {
          boxShadowAnim: [
            "0 0 10px 0px rgba(245, 158, 11, 0.08)", 
            "0 0 18px 2px rgba(245, 158, 11, 0.12)",
            "0 0 10px 0px rgba(245, 158, 11, 0.08)"
          ],
          opacityAnim: [0.25, 0.35, 0.25],
          duration: 7
        }
      };
    } else {
      return {
        outer: {
          widthAnim: ["35vh", "39vh", "35vh"],
          heightAnim: ["35vh", "39vh", "35vh"],
          opacityAnim: [0.3, 0.25, 0.3],
          duration: 6
        },
        middle: {
          widthAnim: ["28vh", "31vh", "28vh"],
          heightAnim: ["28vh", "31vh", "28vh"],
          opacityAnim: [0.2, 0.15, 0.2],
          duration: 5.5
        },
        inner: {
          widthAnim: ["20vh", "22vh", "20vh"],
          heightAnim: ["20vh", "22vh", "20vh"],
          opacityAnim: [0.15, 0.1, 0.15],
          duration: 5
        },
        center: {
          boxShadowAnim: [
            "0 0 15px 0px rgba(245, 158, 11, 0.1)", 
            "0 0 25px 3px rgba(245, 158, 11, 0.15)",
            "0 0 15px 0px rgba(245, 158, 11, 0.1)"
          ],
          opacityAnim: [0.3, 0.4, 0.3],
          duration: 6
        }
      };
    }
  }, [isMobile]);
  
  return (
    <div className={`fixed inset-0 overflow-hidden z-0 ${className}`}>
      {/* Static background image for chat */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isChat ? (isMobile ? 0.6 : 0.55) : (isMobile ? 1.4 : 1.52) }}
        transition={{ duration: 0.8 }}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isMobile ? 'from-slate-900/90 to-slate-900/98' : 'from-slate-900/80 to-slate-900/95'
        } z-10`} />
        <Image
          src="/background2.jpeg"
          alt="Divine background"
          fill
          className={`object-cover ${isMobile ? 'blur-[0.5px]' : 'blur-[1px]'}`}
          priority
        />
      </motion.div>

      {/* Only show pulsing rings on non-chat pages */}
      {!isChat && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Outer pulsing ring */}
          <motion.div
            className="rounded-full border-2 border-amber-400/30 absolute"
            initial={{ width: ringAnimations.outer.widthAnim[0], height: ringAnimations.outer.heightAnim[0] }}
            animate={{ 
              width: ringAnimations.outer.widthAnim, 
              height: ringAnimations.outer.heightAnim,
              opacity: ringAnimations.outer.opacityAnim
            }}
            transition={{ 
              duration: ringAnimations.outer.duration,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Middle pulsing ring */}
          <motion.div
            className="rounded-full border border-amber-300/20 absolute"
            initial={{ width: ringAnimations.middle.widthAnim[0], height: ringAnimations.middle.heightAnim[0] }}
            animate={{ 
              width: ringAnimations.middle.widthAnim,
              height: ringAnimations.middle.heightAnim,
              opacity: ringAnimations.middle.opacityAnim
            }}
            transition={{ 
              duration: ringAnimations.middle.duration,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
          />
          
          {/* Inner pulsing ring */}
          <motion.div
            className="rounded-full border border-amber-200/15 absolute"
            initial={{ width: ringAnimations.inner.widthAnim[0], height: ringAnimations.inner.heightAnim[0] }}
            animate={{ 
              width: ringAnimations.inner.widthAnim,
              height: ringAnimations.inner.heightAnim,
              opacity: ringAnimations.inner.opacityAnim
            }}
            transition={{ 
              duration: ringAnimations.inner.duration,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
          
          {/* Center glow */}
          <motion.div
            className={`rounded-full ${isMobile ? 'bg-amber-500/4' : 'bg-amber-500/5'} backdrop-blur-sm absolute`}
            initial={{ width: isMobile ? "10vh" : "12vh", height: isMobile ? "10vh" : "12vh" }}
            animate={{ 
              boxShadow: ringAnimations.center.boxShadowAnim,
              opacity: ringAnimations.center.opacityAnim
            }}
            transition={{ 
              duration: ringAnimations.center.duration,
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