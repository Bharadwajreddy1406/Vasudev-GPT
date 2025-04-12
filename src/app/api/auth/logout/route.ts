import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // NextAuth handles session deletion through its API
    // This route just provides a custom API endpoint if needed
    
    // Clear any session cookies manually just to be safe
    (await
      // NextAuth handles session deletion through its API
      // This route just provides a custom API endpoint if needed
      // Clear any session cookies manually just to be safe
      cookies()).delete('next-auth.session-token');
    (await cookies()).delete('next-auth.csrf-token');
    (await cookies()).delete('next-auth.callback-url');
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}