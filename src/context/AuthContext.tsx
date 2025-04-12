'use client';

import React, { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn, signOut, useSession } from 'next-auth/react';

type User = {
  id: string;
  email: string;
  username: string;
  avatar: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string, avatar: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();
  
  // Extract user from NextAuth session
  const user = session?.user ? {
    id: session.user.id,
    email: session.user.email || '',
    username: session.user.username || '',
    avatar: session.user.avatar || '',
  } : null;

  // Login function using NextAuth
  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success('Login successful!');
        router.push('/');
        router.refresh(); // Refresh to update session
      } else {
        toast.error(result?.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
    }
  };

  // Sign up function
  const signup = async (email: string, username: string, password: string, avatar: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password, avatar }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Account created successfully!');
        router.push('/login');
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again.');
    }
  };

  // Logout function using NextAuth
  const logout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh(); // Refresh to update session
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};