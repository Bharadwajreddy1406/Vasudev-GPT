import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getUserRecentActivity } from '@/lib/chat-utils';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || "krishna_divine_wisdom_secret_key" 
    });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get recent chat activity for the user
    const recentActivity = await getUserRecentActivity(token.id as string);
    
    return NextResponse.json({ 
      success: true, 
      data: recentActivity 
    });
    
  } catch (error: any) {
    console.error('Error fetching recent chat activity:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}