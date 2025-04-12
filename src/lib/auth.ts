import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

// User type definition
export interface UserSession {
  id: string;
  email: string;
  username: string;
  avatar: string;
}

// Get current user from NextAuth session
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return null;
    }
    
    return session.user as UserSession;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Authentication middleware helper
export async function withAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Server-side auth check that redirects to login if user is not authenticated
// Note: This should only be used in Server Components or Server Actions
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }
  
  return session.user as UserSession;
}

// Type definition for NextAuth
declare module "next-auth" {
  interface Session {
    user: UserSession;
  }

  interface User {
    id: string;
    email: string;
    username: string;
    avatar: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string;
    avatar: string;
  }
}