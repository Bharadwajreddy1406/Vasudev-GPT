import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/signup';
  
  // Get the token from the cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // Check if the user is trying to post a message in the chat
  const isChatInteraction = 
    (path.startsWith('/api/chat') && request.method === 'POST') || 
    path === '/chat' || 
    path.startsWith('/chat/');
  
  // If user is on a public path and has a valid token, redirect to home
  if (isPublicPath && token) {
    try {
      const user = await verifyJWT(token);
      if (user) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Invalid token - let them continue to login/signup
      console.error('Error verifying token:', error);
    }
  }
  
  // If it's a chat API interaction and no valid token, redirect to login
  if (isChatInteraction) {
    if (!token) {
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
    
    try {
      const user = await verifyJWT(token);
      if (!user) {
        if (path.startsWith('/api/')) {
          return NextResponse.json(
            { success: false, message: 'Invalid or expired token', redirectTo: '/login' },
            { status: 401 }
          );
        }
        
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      if (path.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, message: 'Authentication error', redirectTo: '/login' },
          { status: 401 }
        );
      }
      
      return NextResponse.redirect(new URL('/login', request.url));
    }
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