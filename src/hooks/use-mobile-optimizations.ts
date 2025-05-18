'use client';

import { useEffect, useState } from 'react';
import { useDeviceInfo } from '@/hooks/use-mobile';

/**
 * Utility hook for detecting browser/OS
 */
export function useBrowserInfo() {
  const [browserInfo, setBrowserInfo] = useState({
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isEdge: false,
  });

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setBrowserInfo({
      isIOS: /iphone|ipad|ipod/.test(ua),
      isAndroid: /android/.test(ua),
      isSafari: /safari/.test(ua) && !/chrome/.test(ua),
      isChrome: /chrome/.test(ua) && !/edge/.test(ua),
      isFirefox: /firefox/.test(ua),
      isEdge: /edge/.test(ua),
    });
  }, []);

  return browserInfo;
}

/**
 * Hook for optimizing animations based on device capabilities
 */
export function useAnimationOptimizer() {
  const { isMobile, isPrefersReducedMotion } = useDeviceInfo();
  const [limitAnimations, setLimitAnimations] = useState(false);

  useEffect(() => {
    const checkPerformance = () => {
      // Check if user prefers reduced motion
      if (isPrefersReducedMotion) {
        setLimitAnimations(true);
        return;
      }

      // Check hardware capabilities
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        setLimitAnimations(true);
        return;
      }

      // Check memory (not available in all browsers)
      if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) {
        setLimitAnimations(true);
        return;
      }

      // Check for very small screens (likely older/less powerful devices)
      if (window.innerWidth < 360 || window.innerHeight < 480) {
        setLimitAnimations(true);
        return;
      }

      // Battery status check if available
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          // If battery level is low and not charging, limit animations
          if (battery.level < 0.15 && !battery.charging) {
            setLimitAnimations(true);
          }
        }).catch(() => {
          // If we can't check battery, make decision based on other factors
        });
      }
    };

    checkPerformance();
  }, [isMobile, isPrefersReducedMotion]);

  return {
    limitAnimations,
    // Animation duration modifier
    durationModifier: limitAnimations ? 0.6 : isMobile ? 0.8 : 1,
    // Complexity modifier for particles, effects, etc.
    complexityModifier: limitAnimations ? 0.3 : isMobile ? 0.7 : 1,
  };
}

/**
 * Hook for dynamically loading resources based on device capability
 */
export function useOptimizedResources() {
  const { isMobile, isTablet, isHighDPI } = useDeviceInfo();
  const [resourcePaths, setResourcePaths] = useState({
    backgroundImage: '/background2.jpeg',
    krishnaImage: '/krishna.png',
  });

  useEffect(() => {
    // In a real implementation, you would have different sized resources
    // This is just a placeholder for the concept
    setResourcePaths({
      backgroundImage: isMobile ? '/background2-mobile.jpeg' : '/background2.jpeg',
      krishnaImage: isMobile ? '/krishna-small.png' : isHighDPI ? '/krishna-hd.png' : '/krishna.png',
    });
  }, [isMobile, isTablet, isHighDPI]);

  return resourcePaths;
}

/**
 * Hook for touchscreen-specific adaptations
 */
export function useTouchOptimizations() {
  const { isTouch } = useDeviceInfo();
  
  // Touch-specific adjustments
  const touchStyles = {
    // Larger click targets
    clickableArea: isTouch ? 'p-3' : 'p-2',
    // No hover effects on touch devices
    hoverClass: isTouch ? '' : 'hover:bg-amber-500/10',
    // Touch feedback
    activeClass: isTouch ? 'active:scale-95 active:opacity-80' : '',
  };
  
  return touchStyles;
}

/**
 * Hook for measuring viewport and adjusting UI accordingly
 * Provides values that can be used in inline styles when Tailwind classes aren't flexible enough
 */
export function useViewportAdjustments() {
  const [viewport, setViewport] = useState({
    vh: 0,
    vw: 0,
    smallerDimension: 0,
    isPortrait: true,
  });
  
  useEffect(() => {
    const updateViewport = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setViewport({
        vh,
        vw, 
        smallerDimension: Math.min(vw, vh),
        isPortrait: vh > vw,
      });
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);
  
  // Calculate sizes based on viewport dimensions
  return {
    ...viewport,
    // Percentage of smaller dimension - useful for consistent sizing across devices
    sizeByViewport: (percentage: number) => `${viewport.smallerDimension * (percentage / 100)}px`,
    // Create vh units that work properly on mobile (avoiding iOS safari issues)
    fixedVh: (vh: number) => `${viewport.vh * (vh / 100)}px`,
  };
}
