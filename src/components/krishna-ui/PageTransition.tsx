'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }} // Reduced distance for subtler transition
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }} // Reduced distance for quicker exit
        transition={{
          type: 'tween', // Changed from spring to tween for smoother transition
          duration: 0.25, // Faster transition for better responsiveness
          ease: 'easeOut' // Smoother easing function
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}