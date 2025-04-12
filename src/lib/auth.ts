import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'krishna_divine_wisdom_secret_key';

// User type definition
export interface UserSession {
  id: string;
  email: string;
  username: string;
  avatar: string;
}

// Token expiration time - 1 week
export const TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds

// Sign JWT token
export async function signJWT(payload: UserSession) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT(payload as any)
      .setProtectedHeader({ alg: 'HS256' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(Math.floor(Date.now() / 1000) + TOKEN_EXPIRY)
      .setIssuedAt()
      .sign(secret);
    
    return token;
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw error;
  }
}

// Verify JWT token
export async function verifyJWT(token: string): Promise<UserSession | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as UserSession;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return null;
  }
}

// Set authentication cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'auth-token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: TOKEN_EXPIRY,
    sameSite: 'lax',
  });
}

// Remove authentication cookie
export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

// Get current user from cookies
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const token = (await cookies()).get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const user = await verifyJWT(token);
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Authentication middleware helper
export async function withAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const user = await verifyJWT(token);
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Check authentication in client components
export function useRequireAuth() {
  const user = getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}