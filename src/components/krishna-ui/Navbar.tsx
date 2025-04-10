'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 bg-transparent"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-3xl font-cinzel divine-text">KrishnaGPT</h1>
        </Link>
        
        {/* Center Menu */}
        {/* <div className="hidden md:flex space-x-8">
          <Link href="/" className="font-cinzel text-cream hover:text-gold transition-colors">
            Dummy 1
          </Link>
          <Link href="/" className="font-cinzel text-cream hover:text-gold transition-colors">
            Dummy 2
          </Link>
        </div>
        
        Right Menu */}
        <div>
            <Link 
              href="/" 
              className="font-cinzel text-amber hover:text-gold transition-colors"
              style={{ textShadow: "0 0 5px rgba(255,191,0,0.8)" }}
            >
              About
            </Link>
        </div>
      </div>
    </motion.nav>
  );
}