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
    
    // Initial Krishna animation sequence - optimized timing for smoother transition
    
    // Animation 1: Krishna appears with fade-in (reduced vertical distance)
    animateKrishna(krishnaRef.current,
      { translateY: [100, 0], opacity: [0, 1] },
      { duration: 1.2, ease: "easeOut" }
    );
    
    // Animation 2: Main aura appears with a scale effect (start sooner, finish faster)
    setTimeout(() => {
      animateAura(auraRef.current,
        { scale: [0, 1], opacity: [0, 0.7] },
        { duration: 1.8, ease: "easeOut" } // Simplified ease for better performance
      );
    }, 300); // Start much sooner after first animation starts
    
    // Animation 3: Top aura appears (start sooner, finish faster)
    setTimeout(() => {
      animateTopAura(topAuraRef.current,
        { scale: [0, 1], opacity: [0, 0.9] },
        { duration: 1.2, ease: "easeOut" } // Simplified ease for better performance
      );
    }, 600); // Start sooner for more cohesive appearance
    
    // Start continuous animations right after the initial sequence completes
    setTimeout(() => {
      // Floating animation for Krishna - slower and more subtle
      animateKrishna(krishnaRef.current,
        { translateY: ["-3px", "3px"] }, 
        { 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      );
      
      // Enhanced pulsating glow for the main aura - gentler, less distracting
      animateAura(auraRef.current,
        { 
          scale: [0.92, 1.08], // Reduced scale change for subtlety
          opacity: [0.6, 0.7] // Less opacity variation
        }, 
        { 
          duration: 5, // Slower for gentle pulsing
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut" // Simplified for smoother animation
        }
      );
      
      // Pulsating glow for the top aura - gentler, coordinated with main aura
      animateTopAura(topAuraRef.current,
        { 
          scale: [0.9, 1.1], // Reduced scale range
          opacity: [0.7, 0.85] // Less dramatic change
        }, 
        {
          duration: 5.5, // Slightly offset from main aura for natural feel
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut" // Simplified for smoother animation
        }
      );
      
      // Begin the color transition after animations start
      setTimeout(() => {
        // Color transition animation for the main aura - quicker but still smooth
        animateAuraOverlay(auraOverlayRef.current,
          { opacity: [0, 0.7] },
          { duration: 3, ease: "easeInOut" }
        );
      }, 1000); // Start color transition sooner
    }, 1500); // Start continuous animations sooner
    
  }, [animateKrishna, animateAura, animateTopAura, animateAuraOverlay, animationsStarted]);
  
  return (
    <div className={`relative flex items-center justify-center h-[400px] w-[400px] ${className}`} ref={containerRef}>
      {/* Main background aura behind Krishna */}
      <motion.div 
        ref={auraRef} 
        className="absolute rounded-full bg-amber-400/70 w-[400px] h-[400px] blur-xl"
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
        className="absolute shadow-amber-400 shadow-2xl rounded-full bg-amber-400/90 w-[350px] h-[350px] blur-md top-[30px]"
        style={{ 
          filter: 'drop-shadow(0 0 20px rgba(99, 198, 235, 0.8))',
          backdropFilter: 'blur(2px)',
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