'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import imageUrls from '@/utils/Icons';
import { motion } from 'framer-motion';
import { CheckIcon, Loader2Icon } from 'lucide-react';

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

export default function SignupPage() {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form validation states
  const [validEmail, setValidEmail] = useState<boolean | null>(null);
  const [validPassword, setValidPassword] = useState<boolean | null>(null);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  // Function to randomly select an avatar
  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    setAvatar(imageUrls[randomIndex]);
  };

  // Randomly select an avatar on component mount
  useEffect(() => {
    getRandomAvatar();
  }, []);

  // Validate email format
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidEmail(emailRegex.test(email));
    }
  }, [email]);
  
  // Validate password strength
  useEffect(() => {
    if (password) {
      setValidPassword(password.length >= 8);
    }
  }, [password]);
  
  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate form inputs
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      await signup(email, username, password, avatar);
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
            src="/background2.jpeg" 
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
            "When doubt clouds your mind, turn within — I'm always there."
          </p>
          <p className="mt-2 text-sm text-white/80 text-right">— Lord Krishna</p>
        </motion.div>
      </div>
      
      {/* Right panel with signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-gradient-to-b from-[#031C3E] to-[#092A5E] overflow-y-hidden">
        <StarryBackground />
        
        {/* Form container with glassmorphic effect */}        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-4 sm:p-6 mx-4 sm:mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-4 text-center font-cinzel text-white"
            style={{ textShadow: '0 2px 10px rgba(99, 198, 235, 0.5)' }}
          >
            Begin Your Journey
          </motion.h1>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-2 text-sm text-white rounded bg-red-500/70 backdrop-blur-sm border border-red-400/30"
            >
              {error}
            </motion.div>
          )}
          
          <motion.form 
            variants={staggerFormItems}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit} 
            className="space-y-3"
          >
            {/* Email field */}
            <motion.div variants={fadeInUp} className="space-y-1">
              <div className="flex justify-between items-center">
                <label 
                  htmlFor="email" 
                  className="text-xs font-medium text-gray-200 flex items-center gap-2"
                >
                  Email
                  {validEmail === true && <CheckIcon className="h-3 w-3 text-green-400" />}
                </label>
              </div>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-8 p-2 border rounded-lg bg-white/5 text-white border-white/10 focus:border-blue-400 transition-all focus:ring-2 focus:ring-blue-400/30 placeholder:text-gray-400"
                />
              </div>
            </motion.div>
            
            {/* Username field */}
            <motion.div variants={fadeInUp} className="space-y-1">
              <label 
                htmlFor="username" 
                className="text-xs font-medium text-gray-200"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                className="w-full h-8 p-2 border rounded-lg bg-white/5 text-white border-white/10 focus:border-blue-400 transition-all focus:ring-2 focus:ring-blue-400/30 placeholder:text-gray-400"
              />
            </motion.div>
            
            {/* Password fields in a grid for compactness */}
            <div className="grid grid-cols-2 gap-3">
              {/* Password field */}
              <motion.div variants={fadeInUp} className="space-y-1">
                <div className="flex justify-between items-center">
                  <label 
                    htmlFor="password" 
                    className="text-xs font-medium text-gray-200 flex items-center gap-2"
                  >
                    Password
                    {validPassword === true && <CheckIcon className="h-3 w-3 text-green-400" />}
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (8+ chars)"
                  required
                  className="w-full h-8 p-2 border rounded-lg bg-white/5 text-white border-white/10 focus:border-blue-400 transition-all focus:ring-2 focus:ring-blue-400/30 placeholder:text-gray-400 text-sm"
                />
              </motion.div>
              
              {/* Confirm Password field */}
              <motion.div variants={fadeInUp} className="space-y-1">
                <div className="flex justify-between items-center">
                  <label 
                    htmlFor="confirmPassword" 
                    className="text-xs font-medium text-gray-200 flex items-center gap-2"
                  >
                    Confirm
                    {passwordsMatch === true && <CheckIcon className="h-3 w-3 text-green-400" />}
                  </label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className="w-full h-8 p-2 border rounded-lg bg-white/5 text-white border-white/10 focus:border-blue-400 transition-all focus:ring-2 focus:ring-blue-400/30 placeholder:text-gray-400 text-sm"
                />
              </motion.div>
            </div>
            
            {/* Password validation messages */}
            <div className="flex justify-between text-xs">
              {password && !validPassword && (
                <p className="text-amber-300">Password should be 8+ characters</p>
              )}
              {confirmPassword && !passwordsMatch && (
                <p className="text-amber-300">Passwords don't match</p>
              )}
            </div>
            
            {/* Avatar selection */}
            <motion.div variants={fadeInUp} className="flex items-center justify-between pt-1">
              <label className="text-xs font-medium text-gray-200">
                Your Avatar
              </label>
              <div className="flex items-center gap-3">
                {avatar && (
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 blur-md animate-pulse opacity-70"></div>
                    <Image 
                      src={avatar} 
                      alt="Selected avatar" 
                      width={50} 
                      height={50} 
                      className="rounded-full border-2 border-blue-400/50 relative z-10 object-cover"
                    />
                  </motion.div>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={getRandomAvatar}
                  className="text-xs py-1 px-3 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 transition-all duration-200 backdrop-blur-sm"
                >
                  ✨ Change
                </motion.button>
              </div>
            </motion.div>
            
            {/* Submit button */}
            <motion.div variants={fadeInUp}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 h-9 rounded-xl text-white font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  background: 'linear-gradient(to right, #285CA2, #3592BD)',
                  boxShadow: '0 4px 10px rgba(53, 146, 189, 0.3), 0 0 15px rgba(53, 146, 189, 0.2)'
                }}
              >
                {isLoading ? (
                  <span className="flex items-center text-white gap-2">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </span>
                ) : "Create Account"}
              </Button>
            </motion.div>
          </motion.form>
          
          {/* Login link */}
          <motion.div 
            variants={fadeInUp}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1 } }}
            className="mt-3 text-center"
          >
            <p className="text-xs text-gray-300">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="font-semibold relative text-blue-400 hover:text-blue-300 transition-colors duration-200 group"
              >
                Sign In
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}