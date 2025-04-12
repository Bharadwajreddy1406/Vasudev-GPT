import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './auth';
import type { UserSession } from './auth';

/**
 * Utility function to authenticate API routes
 * Returns authenticated user or throws an error
 */
export async function authenticateRequest(req: NextRequest): Promise<UserSession> {
  try {
    const token = req.cookies.get('auth-token')?.value;
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const user = await verifyJWT(token);
    
    if (!user) {
      throw new Error('Invalid token');
    }
    
    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * Higher-order function for wrapping API handlers with authentication
 */
export function withApiAuth(handler: (req: NextRequest, user: UserSession) => Promise<NextResponse>) {
  return async function(req: NextRequest) {
    try {
      const user = await authenticateRequest(req);
      return await handler(req, user);
    } catch (error: any) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message || 'Authentication failed',
          redirectTo: '/login'
        },
        { status: 401 }
      );
    }
  };
}