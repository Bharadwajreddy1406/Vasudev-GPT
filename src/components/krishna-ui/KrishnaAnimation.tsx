'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { animate, createScope, createTimeline } from 'animejs';

interface KrishnaAnimationProps {
  className?: string;
}

export default function KrishnaAnimation({ className }: KrishnaAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const krishnaRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const topAuraRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<any>(null);
  // Track aura color transition
  const [auraColorTransition, setAuraColorTransition] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scope for animations with the container as root
    scopeRef.current = createScope({ 
      root: containerRef.current 
    }).add(scope => {
      // Initial Krishna animation sequence with proper timeline parameters
      const timeline = createTimeline({
        autoplay: true,
        defaults: {
          duration: 5500,
          ease: 'outQuad'
        }
      });
      
      // Add animations to timeline
      // Animation 1: Krishna floats up from bottom
      timeline.add('#krishna-image', {
        translateY: [200, 0],
        opacity: [0, 1],
        duration: 2000
      });
      
      // Animation 2: Main aura appears with a scale effect
      timeline.add('#krishna-aura', {
        scale: [0, 1],
        opacity: [0, 0.7],
        duration: 5500,
        ease: 'outElastic(1, .5)'
      }, '-=500'); // Start 500ms before previous animation ends

      // Animation 3: Top aura appears
      timeline.add('#krishna-top-aura', {
        scale: [0, 1],
        opacity: [0, 0.9],
        duration: 1800,
        ease: 'outElastic(1, .5)'
      }, '-=1200'); // Overlap with main aura animation
      
      // Register functions for continuous animations
      scope.add('startFloating', () => {
        // Floating animation for Krishna
        animate('#krishna-image', {
          translateY: [-5, 5],
          duration: 7000,
          direction: 'alternate',
          loop: true,
          easing: 'inOutSine'
        });
        
        // Enhanced pulsating glow for the main aura with more dramatic scaling
        // Using more symmetric easing function for smooth shrinking
        animate('#krishna-aura', {
          scale: [0.85, 1.15], // More dramatic scaling effect
          opacity: [0.5, 0.7],
          duration: 4000,
          direction: 'alternate',
          loop: true,
          easing: 'cubicBezier(.45, 0, .55, 1)' // Smoother symmetric easing for growing and shrinking
        });

        // Pulsating glow for the top aura with more varied scale values
        animate('#krishna-top-aura', {
          scale: [0.82, 1.35], // More varied scale for dramatic effect
          opacity: [0.65, 0.9],
          duration: 4200, // Slightly longer duration for desynchronized effect with main aura
          direction: 'alternate',
          loop: true,
          easing: 'cubicBezier(.45, 0, .55, 1)' // Same smooth easing for consistency
        });
      });
      
      // Start continuous animations after the initial sequence
      setTimeout(() => {
        scope.methods.startFloating();
        
        // Begin the color transition after animations start
        setTimeout(() => {
          // Trigger aura color transition
          setAuraColorTransition(true);
          
          // Color transition animation for the main aura

          animate('#krishna-aura-overlay', {
            opacity: [0, 0.8], // Fade in the amber overlay
            duration: 8000, // Slow transition
            easing: 'easeInOutSine'
          });
        }, 3000); // Start color transition 3 seconds after main animations
      }, 2500);
    });
    
    // Cleanup animations when component unmounts
    return () => {
      if (scopeRef.current) {
        scopeRef.current.revert();
      }
    };
  }, []);
  
  return (
    <div className={`relative flex items-center justify-center ${className}`} ref={containerRef}>
      {/* Main background aura behind Krishna */}
      <div 
        id="krishna-aura"
        ref={auraRef} 
        className="absolute rounded-full bg-[#E8F1FF]/70 w-[400px] h-[400px] blur-xl z-0"
        style={{ opacity: 0 }} // Initially hidden
      >
        {/* Amber overlay for color transition effect */}
        <div 
          id="krishna-aura-overlay" 
          className="absolute inset-0 rounded-full bg-amber-400/90 blur-xl z-0"
          style={{ 
            opacity: 0, // Initially transparent
            mixBlendMode: 'overlay'
          }}
        />
      </div>

      {/* Top-centered aura - placed behind the image but in front of the main aura */}
      <div 
        id="krishna-top-aura"
        ref={topAuraRef} 
        className="absolute shadow-[#63C6EB] shadow-2xl rounded-full bg-amber-400/90 w-[350px] h-[350px] blur-md top-[30px] z-1"
        style={{ 
          opacity: 0, 
          filter: 'drop-shadow(0 0 20px rgba(99, 198, 235, 0.8))',
          backdropFilter: 'blur(4px)'
        }} 
      />
      
      {/* Krishna image - in front of both auras */}
      <div id="krishna-image" ref={krishnaRef} className="relative z-10" style={{ opacity: 0 }}>
        <Image
          src="/krishna.png"
          alt="Lord Krishna"
          width={330}
          height={330}
          priority
          className="h-auto"
        />
      </div>
    </div>
  );
}