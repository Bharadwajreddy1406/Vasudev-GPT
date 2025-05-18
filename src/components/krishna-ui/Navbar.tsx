'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 bg-transparent ${
        isOnChatPage ? 'border-b border-amber-500/20 shadow-xs shadow-amber-500/10' : ''
      }`}
      initial={{ opacity: 0, y: -10 }} // Reduced distance for subtler motion
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }} // Faster animation for better responsiveness
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-3xl font-cinzel divine-text">KrishnaGPT</h1>
        </Link>
        
        {/* Right Menu */}
        <div className="flex items-center space-x-6">
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
      </div>
    </motion.nav>
  );
}