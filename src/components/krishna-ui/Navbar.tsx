'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isOnChatPage = pathname?.includes('/chat');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:py-4 bg-transparent ${
        isOnChatPage ? 'border-b border-amber-500/20 shadow-xs shadow-amber-500/10' : ''
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl sm:text-3xl font-cinzel divine-text">KrishnaGPT</h1>
        </Link>
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-amber-200 focus:outline-none p-1"
          >
            {isMobileMenuOpen ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="8" x2="20" y2="8"></line>
                <line x1="4" y1="16" x2="20" y2="16"></line>
              </svg>
            )}
          </button>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/about" 
            className="font-cinzel hover:text-gold transition-colors divine-text"
          >
            About
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-400/50 transition-all hover:border-amber-400">
                  {user.avatar && (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0d051a] border border-amber-500/30">
                <div className="px-2 py-1.5 text-sm text-amber-200 border-b border-amber-500/20">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs text-amber-400/70 truncate">{user.email}</p>
                </div>
                <DropdownMenuItem 
                  className="cursor-pointer text-amber-200 hover:bg-amber-900/20 hover:text-amber-100 focus:bg-amber-900/20"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                >
                  {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              href="/login" 
              className="font-cinzel hover:text-gold transition-colors divine-text"
            >
              Login
            </Link>
          )}
        </div>
        
        {/* Mobile Menu (Dropdown) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/20 py-4 px-4 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4">
                <Link 
                  href="/about" 
                  className="font-cinzel hover:text-gold transition-colors divine-text py-2 px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                
                {user ? (
                  <div className="border-t border-amber-500/20 pt-3 mt-1">
                    <div className="flex items-center gap-3 mb-2">
                      {user.avatar && (
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400/50">
                          <Image
                            src={user.avatar}
                            alt={user.username}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-amber-200 text-sm">{user.username}</p>
                        <p className="text-xs text-amber-400/70 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button 
                      className="w-full text-left text-amber-200 hover:text-amber-100 py-2 px-2 rounded hover:bg-amber-900/20 transition-colors"
                      disabled={isLoggingOut}
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="font-cinzel hover:text-gold transition-colors divine-text py-2 px-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}