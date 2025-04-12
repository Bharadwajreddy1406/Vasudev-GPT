'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
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
          src="/background1.jpeg" 
          alt="Krishna background" 
          fill 
          style={{ objectFit: 'cover' }} 
          priority
        />
      </div>
      
      {/* Right panel with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center" 
              style={{ color: 'oklch(45% 0.16 250)' }}>
            Welcome Back
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
                required
                className="w-full p-2 border rounded"
                style={{ borderColor: 'oklch(85% 0.1 250)' }}
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-hover"
              style={{ 
                backgroundColor: 'oklch(55% 0.2 250)', 
                color: 'white'
              }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold hover:underline" style={{ color: 'oklch(45% 0.2 250)' }}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}