import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { UserSession } from './auth';

/**
 * Utility function to authenticate API routes
 * Returns authenticated user or throws an error
 */
export async function authenticateRequest(req: NextRequest): Promise<UserSession> {
  try {
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET || "krishna_divine_wisdom_secret_key"
    });
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    return {
      id: token.id as string,
      email: token.email as string,
      username: token.username as string,
      avatar: token.avatar as string
    };
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