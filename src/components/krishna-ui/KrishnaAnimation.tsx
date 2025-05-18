'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useAnimate } from 'framer-motion';
import { useDeviceInfo } from '@/hooks/use-mobile';

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
  
  // Get device info for responsive adjustments
  const { isMobile, isTablet, isPrefersReducedMotion } = useDeviceInfo();
  
  // Determine if we should use simplified animations
  const [useSimplifiedAnimations, setUseSimplifiedAnimations] = useState(false);
  
  useEffect(() => {
    // Check for low performance scenarios
    const checkPerformance = () => {
      const isLowPerf = 
        isPrefersReducedMotion || 
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        (isMobile && window.innerWidth < 360);
      
      setUseSimplifiedAnimations(isLowPerf);
    };
    
    checkPerformance();
  }, [isMobile, isPrefersReducedMotion]);
  
  useEffect(() => {
    if (!containerRef.current || animationsStarted) return;
    
    // Set animation started to prevent duplicate animations on re-renders
    setAnimationsStarted(true);
    
    // Initial Krishna animation sequence with device-specific optimizations
    
    // Animation 1: Krishna appears with fade-in
    animateKrishna(krishnaRef.current,
      { translateY: useSimplifiedAnimations ? [50, 0] : [100, 0], opacity: [0, 1] },
      { duration: useSimplifiedAnimations ? 0.8 : 1.2, ease: "easeOut" }
    );
    
    // Animation 2: Main aura appears with a scale effect
    setTimeout(() => {
      animateAura(auraRef.current,
        { scale: [0, 1], opacity: [0, useSimplifiedAnimations ? 0.6 : 0.7] },
        { duration: useSimplifiedAnimations ? 1.2 : 1.8, ease: "easeOut" }
      );
    }, useSimplifiedAnimations ? 200 : 300);
    
    // Animation 3: Top aura appears
    setTimeout(() => {
      animateTopAura(topAuraRef.current,
        { scale: [0, 1], opacity: [0, useSimplifiedAnimations ? 0.8 : 0.9] },
        { duration: useSimplifiedAnimations ? 0.8 : 1.2, ease: "easeOut" }
      );
    }, useSimplifiedAnimations ? 400 : 600);
    
    // Start continuous animations right after the initial sequence completes
    setTimeout(() => {
      // Skip continuous animations if using simplified mode
      if (useSimplifiedAnimations) {
        // Just set static positions for simplified mode
        animateKrishna(krishnaRef.current, { translateY: 0 }, { duration: 0 });
        animateAura(auraRef.current, { scale: 1, opacity: 0.65 }, { duration: 0 });
        animateTopAura(topAuraRef.current, { scale: 1, opacity: 0.8 }, { duration: 0 });
        
        // Simple fade in for aura overlay
        animateAuraOverlay(auraOverlayRef.current, { opacity: 0.6 }, { duration: 1.5 });
        return;
      }
      
      // Floating animation for Krishna - optimized for device
      animateKrishna(krishnaRef.current,
        { translateY: isMobile ? ["-2px", "2px"] : ["-3px", "3px"] }, 
        { 
          duration: isMobile ? 4 : 5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      );
      
      // Enhanced pulsating glow for the main aura - adjusted for device
      animateAura(auraRef.current,
        { 
          scale: isMobile ? [0.94, 1.06] : [0.92, 1.08],
          opacity: isMobile ? [0.6, 0.66] : [0.6, 0.7]
        }, 
        { 
          duration: isMobile ? 4 : 5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      );
      
      // Pulsating glow for the top aura - adjusted for device
      animateTopAura(topAuraRef.current,
        { 
          scale: isMobile ? [0.92, 1.08] : [0.9, 1.1],
          opacity: isMobile ? [0.7, 0.8] : [0.7, 0.85]
        }, 
        {
          duration: isMobile ? 4.5 : 5.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      );
      
      // Begin the color transition after animations start
      setTimeout(() => {
        // Color transition animation for the main aura
        animateAuraOverlay(auraOverlayRef.current,
          { opacity: [0, isMobile ? 0.6 : 0.7] },
          { duration: isMobile ? 2 : 3, ease: "easeInOut" }
        );
      }, isMobile ? 800 : 1000);
    }, useSimplifiedAnimations ? 1000 : 1500);
    
  }, [animateKrishna, animateAura, animateTopAura, animateAuraOverlay, animationsStarted, isMobile, useSimplifiedAnimations]);
  
  // Determine size classes based on device type
  const sizeClasses = isMobile 
    ? 'h-[240px] w-[240px]' 
    : isTablet 
      ? 'h-[320px] w-[320px]' 
      : 'h-[400px] w-[400px]';
      
  // Determine aura blur and opacity based on device
  const auraClasses = isMobile ? 'blur-md bg-amber-400/60' : 'blur-xl bg-amber-400/70';
  const overlayClasses = isMobile ? 'blur-md bg-amber-400/80' : 'blur-xl bg-amber-400/90';
  
  // Top aura size classes
  const topAuraClasses = isMobile 
    ? 'w-[200px] h-[200px] blur-[6px] top-[20px]' 
    : isTablet 
      ? 'w-[280px] h-[280px] blur-md top-[20px]' 
      : 'w-[350px] h-[350px] blur-md top-[30px]';
  
  // Krishna image size
  const imageClass = isMobile ? 'w-[200px]' : isTablet ? 'w-[260px]' : 'w-[330px]';
  
  return (
    <div 
      className={`relative flex items-center justify-center ${sizeClasses} ${className}`} 
      ref={containerRef}
    >
      {/* Main background aura behind Krishna */}
      <motion.div 
        ref={auraRef} 
        className={`absolute rounded-full ${auraClasses} w-full h-full`}
        style={{ zIndex: 1 }}
        initial={{ opacity: 0, scale: 0 }}
      >
        {/* Amber overlay for color transition effect */}
        <motion.div 
          ref={auraOverlayRef}
          className={`absolute inset-0 rounded-full ${overlayClasses}`}
          initial={{ opacity: 0 }}
          style={{ mixBlendMode: 'overlay', zIndex: 2 }}
        />
      </motion.div>
      
      {/* Top-centered aura - placed behind the image but in front of the main aura */}
      <motion.div 
        ref={topAuraRef}
        className={`absolute shadow-amber-400 shadow-xl rounded-full bg-amber-400/${isMobile ? '80' : '90'} ${topAuraClasses}`}
        style={{ 
          filter: isMobile 
            ? 'drop-shadow(0 0 10px rgba(99, 198, 235, 0.7))' 
            : 'drop-shadow(0 0 20px rgba(99, 198, 235, 0.8))',
          backdropFilter: isMobile ? 'blur(1px)' : 'blur(2px)',
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
          className={`h-auto ${imageClass}`}
        />
      </motion.div>
    </div>
  );
}