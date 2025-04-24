'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster } from 'react-hot-toast';
import imageUrls from '@/utils/Icons';

export default function SignupPage() {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to randomly select an avatar
  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    setAvatar(imageUrls[randomIndex]);
  };

  // Randomly select an avatar on component mount
  useEffect(() => {
    getRandomAvatar();
  }, []);

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
    <div className="flex h-screen">
      <Toaster />
      
      {/* Left panel with background image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image 
          src="/background2.jpeg" 
          alt="Krishna background" 
          fill 
          style={{ objectFit: 'cover' }} 
          priority
        />
      </div>
      
      {/* Right panel with signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center" 
              style={{ color: 'oklch(45% 0.16 250)' }}>
            Create Account
          </h1>
          
          {error && (
            <div className="mb-4 p-3 text-sm text-white rounded bg-red-500">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-sm font-medium"
                style={{ color: 'oklch(35% 0.1 250)' }}
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
                className="w-full p-2 border rounded"
                style={{ borderColor: 'oklch(85% 0.1 250)' }}
              />
            </div>
            
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="text-sm font-medium"
                style={{ color: 'oklch(35% 0.1 250)' }}
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
                className="w-full p-2 border rounded"
                style={{ borderColor: 'oklch(85% 0.1 250)' }}
              />
            </div>
            
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="text-sm font-medium"
                style={{ color: 'oklch(35% 0.1 250)' }}
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="w-full p-2 border rounded"
                style={{ borderColor: 'oklch(85% 0.1 250)' }}
              />
            </div>
            
            <div className="space-y-2">
              <label 
                htmlFor="confirmPassword" 
                className="text-sm font-medium"
                style={{ color: 'oklch(35% 0.1 250)' }}
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full p-2 border rounded"
                style={{ borderColor: 'oklch(85% 0.1 250)' }}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium block mb-2" style={{ color: 'oklch(35% 0.1 250)' }}>
                Your Avatar
              </label>
              <div className="flex flex-col items-center mb-4">
                {avatar && (
                  <Image 
                    src={avatar} 
                    alt="Selected avatar" 
                    width={80} 
                    height={80} 
                    className="rounded-full mb-3 border-2 border-[oklch(85%_0.1_250)] hover:border-[oklch(70%_0.2_250)] transition-all duration-200"
                  />
                )}
                <Button
                  type="button"
                  onClick={getRandomAvatar}
                  className="text-sm py-1 px-3 mt-2"
                  variant="outline"
                  style={{ 
                    borderColor: 'oklch(85% 0.1 250)',
                    color: 'oklch(45% 0.2 250)'
                  }}
                >
                  ✨ Pick Another Avatar
                </Button>
              </div>
              <p className="text-xs text-center text-gray-500">Click the button to try different avatars</p>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 hover:bg-[oklch(50%_0.2_250)]"
              style={{ 
                backgroundColor: 'oklch(55% 0.2 250)', 
                color: 'white'
              }}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: 'oklch(45% 0.2 250)' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}