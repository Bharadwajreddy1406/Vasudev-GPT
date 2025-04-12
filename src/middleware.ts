import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/signup';
  
  // Get the NextAuth session token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || "krishna_divine_wisdom_secret_key" 
  });
  
  // Check if the user is trying to post a message in the chat
  const isChatInteraction = 
    (path.startsWith('/api/chat') && request.method === 'POST') || 
    path === '/chat' || 
    path.startsWith('/chat/');
  
  // If user is on a public path and has a valid token, redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If it's a chat API interaction and no valid token, redirect to login
  if (isChatInteraction && !token) {
    // For API routes, return a JSON response with a 401 status
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required', redirectTo: '/login' },
        { status: 401 }
      );
    }
    
    // For page routes, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/login',
    '/signup',
    '/api/chat/:path*',
    '/chat',
    '/chat/:path*'
  ],
};