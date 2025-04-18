'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useAnimate } from 'framer-motion';

interface KrishnaAnimationProps {
  className?: string;
}

export default function KrishnaAnimation({ className }: KrishnaAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [krishnaRef, animateKrishna] = useAnimate();
  const [auraRef, animateAura] = useAnimate();
  const [topAuraRef, animateTopAura] = useAnimate();
  const [auraOverlayRef, animateAuraOverlay] = useAnimate();
  
  // Track animation state to prevent duplicate animations
  const [animationsStarted, setAnimationsStarted] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current || animationsStarted) return;
    
    // Set animation started to prevent duplicate animations on re-renders
    setAnimationsStarted(true);
    
    // Initial Krishna animation sequence - sequential animations with Framer Motion
    
    // Animation 1: Krishna floats up from bottom
    animateKrishna(krishnaRef.current,
      { translateY: [200, 0], opacity: [0, 1] },
      { duration: 2, ease: "easeOut" }
    );
    
    // Animation 2: Main aura appears with a scale effect
    setTimeout(() => {
      animateAura(auraRef.current,
        { scale: [0, 1], opacity: [0, 0.7] },
        { duration: 5, ease: [0.2, 0.65, 0.3, 0.9] } // Elastic ease approximation
      );
    }, 1500); // Start 1.5s after first animation starts
    
    // Animation 3: Top aura appears
    setTimeout(() => {
      animateTopAura(topAuraRef.current,
        { scale: [0, 1], opacity: [0, 0.9] },
        { duration: 1.8, ease: [0.2, 0.65, 0.3, 0.9] } // Elastic ease approximation
      );
    }, 1800); // Start 1.8s after beginning
    
    // Start continuous animations after the initial sequence
    setTimeout(() => {
      // Floating animation for Krishna
      animateKrishna(krishnaRef.current,
        { translateY: ["-5px", "5px"] }, 
        { 
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      );
      
      // Enhanced pulsating glow for the main aura
      animateAura(auraRef.current,
        { 
          scale: [0.85, 1.15],
          opacity: [0.5, 0.7] 
        }, 
        { 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: [0.45, 0, 0.55, 1] // cubicBezier equivalent
        }
      );
      
      // Pulsating glow for the top aura
      animateTopAura(topAuraRef.current,
        { 
          scale: [0.82, 1.35],
          opacity: [0.65, 0.9] 
        }, 
        {
          duration: 4.2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: [0.45, 0, 0.55, 1] // cubicBezier equivalent
        }
      );
      
      // Begin the color transition after animations start
      setTimeout(() => {
        // Color transition animation for the main aura
        animateAuraOverlay(auraOverlayRef.current,
          { opacity: [0, 0.8] },
          { duration: 8, ease: "easeInOut" }
        );
      }, 3000); // Start color transition 3 seconds after main animations
    }, 2500);
    
  }, [animateKrishna, animateAura, animateTopAura, animateAuraOverlay, animationsStarted]);
  
  return (
    <div className={`relative flex items-center justify-center h-[400px] w-[400px] ${className}`} ref={containerRef}>
      {/* Main background aura behind Krishna */}
      <motion.div 
        ref={auraRef} 
        className="absolute rounded-full bg-[#E8F1FF]/70 w-[400px] h-[400px] blur-xl"
        style={{ zIndex: 1 }}
        initial={{ opacity: 0, scale: 0 }}
      >
        {/* Amber overlay for color transition effect */}
        <motion.div 
          ref={auraOverlayRef}
          className="absolute inset-0 rounded-full bg-amber-400/90 blur-xl"
          initial={{ opacity: 0 }}
          style={{ mixBlendMode: 'overlay', zIndex: 2 }}
        />
      </motion.div>

      {/* Top-centered aura - placed behind the image but in front of the main aura */}
      <motion.div 
        ref={topAuraRef}
        className="absolute shadow-[#63C6EB] shadow-2xl rounded-full bg-amber-400/90 w-[350px] h-[350px] blur-md top-[30px]"
        style={{ 
          filter: 'drop-shadow(0 0 20px rgba(99, 198, 235, 0.8))',
          backdropFilter: 'blur(4px)',
          zIndex: 3
        }}
        initial={{ opacity: 0, scale: 0 }}
      />
      
      {/* Krishna image - in front of both auras */}
      <motion.div 
        ref={krishnaRef} 
        className="relative"
        style={{ zIndex: 5 }}
        initial={{ opacity: 0 }}
      >
        <Image
          src="/krishna.png"
          alt="Lord Krishna"
          width={330}
          height={330}
          priority
          className="h-auto"
        />
      </motion.div>
    </div>
  );
}