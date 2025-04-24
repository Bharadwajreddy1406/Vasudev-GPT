'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Animation variants for form elements
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerFormItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// Starry background component
const StarryBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="absolute rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            opacity: Math.random() * 0.6 + 0.2,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            animation: 'pulsate 5s infinite ease-in-out'
          }}
        />
      ))}
    </div>
  );
};

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Left panel with background image and overlay */}
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image 
            src="/background1.jpeg" 
            alt="Krishna background" 
            fill 
            style={{ objectFit: 'cover' }} 
            priority
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </div>
        
        {/* Glassmorphic quote card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="absolute bottom-16 left-10 max-w-sm p-5 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl"
        >
          <p className="text-lg italic text-white font-cinzel">
            "I am the beginning, middle, and end of all beings."
          </p>
          <p className="mt-2 text-sm text-white/80 text-right">— Lord Krishna</p>
        </motion.div>
      </div>
      
      {/* Right panel with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-gradient-to-b from-[#031C3E] to-[#092A5E] overflow-y-hidden">
        <StarryBackground />
        
        {/* Form container with glassmorphic effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-5 text-center font-cinzel text-white"
            style={{ textShadow: '0 2px 10px rgba(99, 198, 235, 0.5)' }}
          >
            Welcome Back
          </motion.h1>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-2 text-sm text-white rounded bg-red-500/70 backdrop-blur-sm border border-red-400/30"
            >
              {error}
            </motion.div>
          )}
          
          <motion.form 
            variants={staggerFormItems}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            {/* Email field */}
            <motion.div variants={fadeInUp} className="space-y-1.5">
              <label 
                htmlFor="email" 
                className="text-sm font-medium text-gray-200"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full h-9 p-2 border rounded-lg bg-white/5 text-white border-white/10 focus:border-blue-400 transition-all focus:ring-2 focus:ring-blue-400/30 placeholder:text-gray-400"
              />
            </motion.div>
            
            {/* Password field */}
            <motion.div variants={fadeInUp} className="space-y-1.5">
              <label 
                htmlFor="password" 
                className="text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full h-9 p-2 border rounded-lg bg-white/5 text-white border-white/10 focus:border-blue-400 transition-all focus:ring-2 focus:ring-blue-400/30 placeholder:text-gray-400"
              />
            </motion.div>
            
            {/* Submit button */}
            <motion.div variants={fadeInUp} className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 text-white rounded-xl font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  background: 'linear-gradient(to right, #285CA2, #3592BD)',
                  boxShadow: '0 4px 10px rgba(53, 146, 189, 0.3), 0 0 15px rgba(53, 146, 189, 0.2)'
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    Signing In...
                  </span>
                ) : "Sign In"}
              </Button>
            </motion.div>
          </motion.form>
          
          {/* Signup link */}
          <motion.div 
            variants={fadeInUp}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.8 } }}
            className="mt-5 text-center"
          >
            <p className="text-sm text-gray-300">
              Don&apos;t have an account?{" "}
              <Link 
                href="/signup" 
                className="font-semibold relative text-blue-400 hover:text-blue-300 transition-colors duration-200 group"
              >
                Sign Up
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </p>
          </motion.div>
          
          {/* Optional: Forgot password link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-3 text-center"
          >
            {/* <Link 
              href="#" 
              className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
            >
              Forgot your password?
            </Link> */}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}